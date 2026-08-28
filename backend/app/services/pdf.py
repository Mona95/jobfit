import fitz  # PyMuPDF
import io

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """
    Extract all text from a PDF file.
    Returns the text content as a single string.
    """
    pdf_document = fitz.open(stream=file_bytes, filetype="pdf")

    text = ""
    for page in pdf_document:
        text += page.get_text()

    pdf_document.close()

    # Clean up extra whitespace
    text = "\n".join(
        line.strip()
        for line in text.splitlines()
        if line.strip()
    )

    return text


def validate_pdf(file_bytes: bytes) -> bool:
    """
    Check if the uploaded file is a valid PDF.
    Returns True if valid, False otherwise.
    """
    try:
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        is_valid = doc.page_count > 0
        doc.close()
        return is_valid
    except Exception:
        return False