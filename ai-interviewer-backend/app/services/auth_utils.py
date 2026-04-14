from urllib.parse import urlparse

# List of common public email providers to flag
PUBLIC_DOMAINS = {
    "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", 
    "live.com", "icloud.com", "protonmail.com", "aol.com", "zoho.com"
}

def is_corporate_email(email: str) -> bool:
    """Returns True if the email domain is NOT in the public list."""
    try:
        domain = email.split("@")[1].lower()
        return domain not in PUBLIC_DOMAINS
    except:
        return False

def extract_domain_from_url(url: str) -> str:
    """Extracts 'google.com' from 'https://www.google.com/careers'"""
    try:
        # Ensure it has a scheme for urlparse to work correctly
        if not url.startswith(("http://", "https://")):
            url = "https://" + url
        
        domain = urlparse(url).netloc
        # Remove 'www.' if present
        return domain.replace("www.", "")
    except:
        return ""