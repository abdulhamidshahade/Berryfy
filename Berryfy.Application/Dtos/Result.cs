using Berryfy.Application.Constants;

namespace Berryfy.Application.Dtos
{
    public class Result<T>
    {
        public bool IsSuccess => Status == ResultStatus.Success || Status == ResultStatus.NoContent;

        
        public string? Error { get; }

        
        public ResultStatus Status { get; set; }

        
        public T? Value { get; }

        private Result(ResultStatus status, T? value, string? error)
        {
            Status = status;
            Value = value;
            Error = error;
        }

        
        public static Result<T> Success(T value)
            => new(ResultStatus.Success, value, null);

        
        public static Result<T> NoContent()
            => new(ResultStatus.NoContent, default, null);

        
        public static Result<T> ValidationError(string error)
            => new(ResultStatus.ValidationError, default, error);

        
        public static Result<T> Unauthorized(string error = "Unauthorized access.")
            => new(ResultStatus.Unauthorized, default, error);

        
        public static Result<T> Forbidden(string error = "Access denied.")
            => new(ResultStatus.Forbidden, default, error);

       
        public static Result<T> NotFound(string error = "Resource not found.")
            => new(ResultStatus.NotFound, default, error);

        public static Result<T> Conflict(string error)
            => new(ResultStatus.Conflict, default, error);

        
        public static Result<T> VerificationRequired(string message)
            => new(ResultStatus.VerificationRequired, default, message);

        
        public static Result<T> Failure(string error)
            => new(ResultStatus.Failure, default, error);
    }
}