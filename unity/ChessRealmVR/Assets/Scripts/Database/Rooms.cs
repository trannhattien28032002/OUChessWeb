using System;
using UnityEngine;

[Serializable]
public class MovingRequestJSON
{
    public string rId;
    public Moving moving;

    public static MovingRequestJSON CreateFromJSON(string data)
    {
        return JsonUtility.FromJson<MovingRequestJSON>(data);
    }
}

public class Moving
{
    public int start;
    public int target;
    public int? flag;
    public string? promotionPiece;
    public string? moveString;
}