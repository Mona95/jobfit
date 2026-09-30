import chromadb
import os
from typing import List

chroma_client = chromadb.PersistentClient(path="./chroma_db")

def get_collection(user_id: str):
    """
    Get or create a ChromaDB collection for a specific user.
    Each user has their own isolated collection.
    """
    return chroma_client.get_or_create_collection(
        name=f"cv_{user_id}"
    )

def get_or_index_cv(user_id: str, cv_id: str, cv_content: str, query: str, n_results: int = 8) -> list[str]:
    """
    Search ChromaDB for relevant CV sections.
    If not indexed yet — automatically indexes first, then searches.
    """
    cv_sections = search_cv(user_id, query, n_results)

    if not cv_sections:
        index_cv(user_id, cv_id, cv_content)
        cv_sections = search_cv(user_id, query, n_results)

    return cv_sections

def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> List[str]:
    """
    Split CV text into overlapping chunks.

    chunk_size: how many characters per chunk
    overlap: how many characters to repeat between chunks
             prevents important context from being cut off at boundaries
    """
    chunks = []
    start = 0

    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]

        if chunk.strip():
            chunks.append(chunk.strip())

        start = end - overlap

    return chunks

def index_cv(user_id: str, cv_id: str, cv_text: str) -> int:
    """
    Index a CV into ChromaDB.
    Chunks the text and stores each chunk as a vector.
    Returns the number of chunks indexed.
    """
    collection = get_collection(user_id)

    # Remove any existing chunks for this CV
    # (in case user re-uploads the same CV)
    try:
        existing = collection.get(where={"cv_id": cv_id})
        if existing["ids"]:
            collection.delete(ids=existing["ids"])
    except Exception:
        pass

    # Chunk the CV text
    chunks = chunk_text(cv_text)

    if not chunks:
        return 0

    # Create unique IDs for each chunk
    chunk_ids = [f"{cv_id}_chunk_{i}" for i in range(len(chunks))]

    # Metadata for each chunk — lets you filter by cv_id later
    metadatas = [{"cv_id": cv_id, "chunk_index": i} for i in range(len(chunks))]

    # Add to ChromaDB — embedding happens automatically
    collection.add(
        ids=chunk_ids,
        documents=chunks,
        metadatas=metadatas
    )

    return len(chunks)

def search_cv(user_id: str, query: str, n_results: int = 5) -> List[str]:
    """
    Search the user's CV for content relevant to a query.
    Returns the most semantically similar chunks.
    """
    collection = get_collection(user_id)

    # Check if collection has any data
    if collection.count() == 0:
        return []

    results = collection.query(
        query_texts=[query],
        n_results=min(n_results, collection.count())
    )

    # Return just the text chunks
    return results["documents"][0] if results["documents"] else []

def delete_cv_index(user_id: str, cv_id: str):
    """
    Remove a CV's chunks from ChromaDB when CV is deleted.
    """
    try:
        collection = get_collection(user_id)
        existing = collection.get(where={"cv_id": cv_id})
        if existing["ids"]:
            collection.delete(ids=existing["ids"])
    except Exception:
        pass