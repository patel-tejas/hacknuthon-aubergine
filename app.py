import streamlit as st
import tempfile
import os
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_community.llms import Ollama
from langchain.chains import RetrievalQA
from langchain_core.prompts import PromptTemplate

# Title & Page Config
st.set_page_config(page_title="Financial Compliance Checker", layout="centered")
st.title("📄 Financial Compliance Checker (PDF + AI)")

# Upload PDF
uploaded_file = st.file_uploader("Upload a PDF file:", type=["pdf"])

# If user uploads a PDF, process it
if uploaded_file is not None:
    with st.spinner("Processing PDF..."):

        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_file:
            tmp_file.write(uploaded_file.read())
            tmp_path = tmp_file.name

        # Load and split PDF
        loader = PyPDFLoader(tmp_path)
        docs = loader.load()
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=50)
        documents = text_splitter.split_documents(docs)

        # Generate Embeddings & Store in FAISS
        embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
        db = FAISS.from_documents(documents, embedding=embeddings)
        retriever = db.as_retriever()

        # Define LLM Model (Make sure you have Ollama installed with `llama3` model)
        llm = Ollama(model="llama3")

        # Define Prompt Template
        prompt_template = PromptTemplate(
            input_variables=["context", "query"],
            template="""
            You are a financial compliance analyst AI trained to strictly evaluate whether a transaction is **compliant** or **non-compliant** based on international transfer rules, monetary thresholds, and country-specific restrictions.

            You will be provided with a transaction query, for example:
            "User A transferred $23452 to User B from XYZ country to ABC country."

            Use the given context (which may include regulations or past cases) to determine the compliance status.

            ### Instructions:
            - Return strictly either: **"Compliant"** or **"Not Compliant - [reason]"**
            - The reasoning must be **clear and concise** if the transaction is not compliant.
            - Do not guess. If the context does not have enough data to determine, assume non-compliance and provide a probable reason.
            - Look for the **first best-matching policy** in the context and respond accordingly.
            - Avoid any extra explanations unless the answer is **Not Compliant**.

            <context>
            {context}
            </context>

            Transaction Query: {query}
            """
        )

        # Create QA Chain
        qa_chain = RetrievalQA.from_chain_type(
            llm=llm,
            retriever=retriever,
            chain_type="stuff",
            return_source_documents=True
        )

        # Display message that PDF is ready
        st.success("✅ PDF processed! Ask questions below.")

        # Keep the temp file path to prevent reloading
        st.session_state["retriever"] = retriever
        st.session_state["qa_chain"] = qa_chain

# Question Input (Appears after PDF upload)
if "qa_chain" in st.session_state:
    user_question = st.text_input("Ask a question about the uploaded PDF:")

    if user_question:
        with st.spinner("Analyzing compliance..."):
            response = st.session_state["qa_chain"].invoke({"query": user_question})
            st.success("🔍 Compliance Check Result:")
            st.write(response["result"])

# Cleanup the temporary file after app finishes
if uploaded_file is None and "qa_chain" in st.session_state:
    os.remove(tmp_path)
    del st.session_state["retriever"]
    del st.session_state["qa_chain"]
