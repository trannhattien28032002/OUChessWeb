using System.Collections;
using System.Collections.Generic;
using System;
using System.Collections;
using System.Text;
using TMPro;
using UnityEngine;
using UnityEngine.Networking;
using UnityEngine.UI;
using UnityEngine.SceneManagement;

public class LoginManager : MonoBehaviour
{
    [Header("Components")]
    [SerializeField] private TextMeshProUGUI _descLabel;
    [SerializeField] private TMP_InputField _nameInput;
    [SerializeField] private TMP_InputField _passwordInput;
    [SerializeField] private Button _loginButton;
    //[SerializeField] private Button _registerButton;

    [Header("Parameters")]
    [SerializeField] private APIClient _authService;

    private void Awake()
    {
        _loginButton.onClick.AddListener(() => {
            StartCoroutine(CoroTrySubmitInfo());
        });
    }

    private IEnumerator CoroTrySubmitInfo()
    {

        _descLabel.text = "Signing in...";

        var username = _nameInput.text;
        var password = _passwordInput.text;

        if (username.Length < 3 || password.Length < 3)
        {
            _descLabel.text = "Invalid credentials";
            yield break;
        }

        SetButtonsEnabled(false);

        Users userAccount = new Users();
        userAccount.username = username;
        userAccount.password = password;
        string bodyJsonString = JsonUtility.ToJson(userAccount);
        Debug.Log(bodyJsonString);
         
        var form = new WWWForm();
        form.AddField("username", username);
        form.AddField("password", password);

        //StartCoroutine(Login(href, bodyJsonString));
        yield return StartCoroutine(_authService.FetchLogin(username, password, OnLoginSuccess, OnLoginFailure));
    }

    private void OnLoginSuccess(string response)
    {
        BaseResponse<Token> resUserLogin = JsonUtility.FromJson<BaseResponse<Token>>(response);
        AppState.Instance.SetState<string>("Token", resUserLogin.data.token);
        AppState.Instance.SetState<string>("RefreshToken", resUserLogin.data.refreshToken);

        SetButtonsEnabled(true);
        SceneManager.LoadScene("Lobby VR Scene");
    }

    private void OnLoginFailure(string error)
    {
        _descLabel.text = "Login failed: " + error;
        SetButtonsEnabled(true);
    }

    private void SetButtonsEnabled(bool flag)
    {
        _loginButton.interactable = flag;
        //_registerButton.interactable = flag;
    }
}