using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UnityEngine;

public class PlayerSpawner : MonoBehaviour
{
    public GameObject player;
    public int numberOfPoint = 15;
    [HideInInspector]
    public List<SpawnPoint> SpawnPoints;
    public SpawnPoint playerSpawnPoint;
}