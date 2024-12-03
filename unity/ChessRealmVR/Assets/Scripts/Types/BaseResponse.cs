using System;

[Serializable]
public class BaseResponse<T>
{
    public T data;
    public string message;
    public int code;
}