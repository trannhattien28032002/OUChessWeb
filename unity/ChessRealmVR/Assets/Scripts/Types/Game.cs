using System.Collections.Generic;
using System;
using UnityEngine;

[Serializable]
public class MovingRequest
{
    public string? rId { get; set; }
    public Moving moving { get; set; }
}

public class Moving
{
    public int startPiece { get; set; }
    public int targetPiece { get; set; }
    public int start { get; set; }
    public int target { get; set; }
    public int? flag { get; set; }
    public string? promotionPiece { get; set; }
    public string? moveString { get; set; }
}