from typing import Optional


class ResumeNotFoundError(Exception):
    """
    Exception raised when a resume is not found in the database.
    """

    def __init__(self, resume_id: Optional[str] = None, message: Optional[str] = None):
        if resume_id and not message:
            message = f"Resume with ID {resume_id} not found."
        elif not message:
            message = "Resume not found."
        super().__init__(message)
        self.resume_id = resume_id


class JobNotFoundError(Exception):
    """
    Exception raised when a job is not found in the database.
    """

    def __init__(self, job_id: Optional[str] = None, message: Optional[str] = None):
        if job_id and not message:
            message = f"Job with ID {job_id} not found."
        elif not message:
            message = "Job not found."
        super().__init__(message)
        self.job_id = job_id


class ResumeValidationError(Exception):
    """
    Exception raised when structured resume validation fails.
    """

    def __init__(
        self,
        resume_id: Optional[str] = None,
        validation_error: Optional[str] = None,
        message: Optional[str] = None,
    ):
        if message:
            # we can use custom message if provided
            pass
        elif validation_error:
            message = f"Resume parsing failed: {validation_error}. Please ensure your resume contains all required information with proper formatting."
        elif resume_id:
            message = f"Resume with ID {resume_id} failed validation during structured parsing."
        else:
            message = "Resume validation failed during structured parsing."
        super().__init__(message)
        self.resume_id = resume_id
        self.validation_error = validation_error


class ResumeParsingError(Exception):
    """
    Exception raised when a resume processing and storing in the database failed.
    """

    def __init__(self, resume_id: Optional[str] = None, message: Optional[str] = None):
        if resume_id and not message:
            message = f"Parsing of resume with ID {resume_id} failed."
        elif not message:
            message = "Parsed resume not found."
        super().__init__(message)
        self.resume_id = resume_id


class JobParsingError(Exception):
    """
    Exception raised when a resume processing and storing in the database failed.
    """

    def __init__(self, job_id: Optional[str] = None, message: Optional[str] = None):
        if job_id and not message:
            message = f"Parsing of job with ID {job_id} failed."
        elif not message:
            message = "Parsed job not found."
        super().__init__(message)
        self.job_id = job_id


class ResumeKeywordExtractionError(Exception):
    """
    Exception raised when keyword extraction from resume failed or no keywords were extracted.
    """

    def __init__(self, resume_id: Optional[str] = None, message: Optional[str] = None):
        if resume_id and not message:
            message = f"Keyword extraction failed for resume with ID {resume_id}. Cannot proceed with resume improvement without extracted keywords."
        elif not message:
            message = "Resume keyword extraction failed. Cannot improve resume without keywords."
        super().__init__(message)
        self.resume_id = resume_id


class JobKeywordExtractionError(Exception):
    """
    Exception raised when keyword extraction from job failed or no keywords were extracted.
    """

    def __init__(self, job_id: Optional[str] = None, message: Optional[str] = None):
        if job_id and not message:
            message = f"Keyword extraction failed for job with ID {job_id}. Cannot proceed with resume improvement without job keywords."
        elif not message:
            message = "Job keyword extraction failed. Cannot improve resume without job requirements."
        super().__init__(message)
        self.job_id = job_id


class EliteComparisonError(Exception):
    """
    Exception raised when elite comparison analysis fails.
    """

    def __init__(self, message: Optional[str] = None, resume_id: Optional[str] = None):
        if resume_id and not message:
            message = f"Elite comparison failed for resume with ID {resume_id}."
        elif not message:
            message = "Elite comparison analysis failed."
        super().__init__(message)
        self.resume_id = resume_id


class ServiceException(Exception):
    """
    General service exception for ROCKET Framework services.
    """

    def __init__(self, message: str, service_name: Optional[str] = None):
        if service_name:
            message = f"[{service_name}] {message}"
        super().__init__(message)
        self.service_name = service_name
