using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;
using UnityEngine.UI;

public class RadioButtonSystem : MonoBehaviour
{
    ToggleGroup toggleGroup;
    void Start()
    {
        toggleGroup = GetComponent<ToggleGroup>();
    }

    public int GetValue()
    {
        Toggle toggle = toggleGroup.ActiveToggles().FirstOrDefault();
        string textToggle = toggle.name;
        if (toggle.name == "OptionWhite")
            return 0;
        else return 1;
    }
}