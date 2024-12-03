using UnityEngine;
using System;
using System.Collections;
using System.Collections.Generic;

public class MatchManager : MonoBehaviour
{
    public MatchState matchState;
    public static event Action<CreateMatchRequest> OnCreateMatch;
    public static event Action<JoinMatchRequest> OnJoinMatch;
    public static event Action<LeaveMatchRequest> OnLeaveMatch;
    public static event Action<MovingRequest> OnMoving;

    private void OnEnable()
    {
        matchState.OnStateChange += HandleStateChange;
        OnCreateMatch += CreateMatch;
        OnJoinMatch += JoinMatch;
        OnLeaveMatch += LeaveMatch;
        OnMoving += Move;
    }

    private void OnDisable()
    {
        matchState.OnStateChange -= HandleStateChange;
        OnCreateMatch -= CreateMatch;
        OnJoinMatch -= JoinMatch;
        OnLeaveMatch -= LeaveMatch;
        OnMoving -= Move;
    }

    private void HandleStateChange()
    {
        // Xử lý thay đổi trạng thái
    }

    private void CreateMatch(CreateMatchRequest request)
    {
        StartCoroutine(CreateMatchCoroutine(request));
    }

    private IEnumerator CreateMatchCoroutine(CreateMatchRequest request)
    {
        // Mô phỏng tác vụ tạo trận đấu bất đồng bộ
        yield return new WaitForSeconds(2);
        var newMatchDetail = new MatchDetail { id = "newMatchId", matchName = request.matchName, state = 0, mode = request.mode };
        matchState.SetState(new MatchState { match = new MatchDetail[] { newMatchDetail }, isLoading = false, lastestMatchId = "newMatchId" });
    }

    private void JoinMatch(JoinMatchRequest request)
    {
        StartCoroutine(JoinMatchCoroutine(request));
    }

    private IEnumerator JoinMatchCoroutine(JoinMatchRequest request)
    {
        // Mô phỏng tác vụ tham gia trận đấu bất đồng bộ
        yield return new WaitForSeconds(2);
        var newMatchDetail = new MatchDetail { id = request.matchId, matchName = "Joined Match", state = 0, mode = 0 };
        matchState.SetState(new MatchState { match = new MatchDetail[] { newMatchDetail }, isLoading = false, lastestMatchId = request.matchId });
    }

    private void LeaveMatch(LeaveMatchRequest request)
    {
        StartCoroutine(LeaveMatchCoroutine(request));
    }

    private IEnumerator LeaveMatchCoroutine(LeaveMatchRequest request)
    {
        // Mô phỏng tác vụ rời trận đấu bất đồng bộ
        yield return new WaitForSeconds(2);
        matchState.SetState(new MatchState());
    }

    private void Move(MovingRequest request)
    {
        StartCoroutine(MoveCoroutine(request));
    }

    private IEnumerator MoveCoroutine(MovingRequest request)
    {
        // Mô phỏng tác vụ di chuyển trong trận đấu bất đồng bộ
        yield return new WaitForSeconds(2);
        // Xử lý di chuyển
        matchState.SetState(new MatchState { match = matchState.match, isLoading = false, lastestMatchId = matchState.lastestMatchId });
    }
}