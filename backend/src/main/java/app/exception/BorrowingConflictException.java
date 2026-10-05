package app.exception;

public class BorrowingConflictException extends RuntimeException {
    public BorrowingConflictException(String message) {
        super(message);
    }
}
