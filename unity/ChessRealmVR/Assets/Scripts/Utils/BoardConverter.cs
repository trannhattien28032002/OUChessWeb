using UnityEngine;

public class BoardConverter
{    public static Vector2Int ConvertCoordinatesVertical(Vector2Int coordinates)
    {
        return new Vector2Int(coordinates.x, 7 - coordinates.y);
    }
    public static Vector2Int ConvertCoordinatesHorizontal(Vector2Int coordinates)
    {
        return new Vector2Int(7 - coordinates.x, coordinates.y);
    }
    public static Vector2Int ConvertCoordinatesBoth(Vector2Int coordinates)
    {
        return new Vector2Int(7 - coordinates.x, 7 - coordinates.y);
    }
}