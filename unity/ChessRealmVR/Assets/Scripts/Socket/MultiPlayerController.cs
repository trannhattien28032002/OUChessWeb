﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEditor.XR.LegacyInputHelpers;
using Unity.XR.CoreUtils;

public class MultiPlayerController : MonoBehaviour
{
    public float Angle = 1f;
    public float DashSpeed = 5f;
    public float SlowSpeed = 1.5f;
    public bool isLocalPlayer = false;

    Transform oldHead = null;
    Transform oldRightHand = null;
    Transform oldLeftHand = null;
    Transform currentHead = null;
    Transform currentRightHand = null;
    Transform currentLeftHand = null;
    Vector3 oldHeadPosition;
    Vector3 oldPosition;
    Vector3 oldRightHandPosition;
    Vector3 oldLeftHandPosition;
    Vector3 currentHeadPosition;
    Vector3 currentPosition;
    Vector3 currentRightHandPosition;
    Vector3 currentLeftHandPosition;
    Quaternion oldHeadRotation;
    Quaternion oldRotation;
    Quaternion oldRightHandRotation;
    Quaternion oldLeftHandRotation;
    Quaternion currentHeadRotation;
    Quaternion currentRotation;
    Quaternion currentRightHandRotation;
    Quaternion currentLeftHandRotation;

    void Reset()
    {
        XROrigin xrOrigin = GetComponentInChildren<XROrigin>();
        Transform cameraOffset = xrOrigin.transform.Find("Camera Offset");

        oldHead = cameraOffset.Find("Main Camera");
        oldHeadPosition = oldHead.position;
        oldHeadRotation = oldHead.rotation;
        oldPosition = transform.position;
        oldRotation = transform.rotation;
        oldRightHand = cameraOffset.Find("Right Controller");
        oldRightHandPosition = oldRightHand.position;
        oldRightHandRotation = oldRightHand.rotation;
        oldLeftHand = cameraOffset.Find("Left Controller");
        oldLeftHandPosition = oldLeftHand.position;
        oldLeftHandRotation = oldLeftHand.rotation;

        currentHeadPosition = oldHead.position;
        currentHeadRotation = oldHead.rotation;
        currentPosition = transform.position;
        currentRotation = transform.rotation;
        currentRightHandPosition = oldRightHand.position;
        currentRightHandRotation = oldRightHand.rotation;
        currentLeftHandPosition = oldLeftHand.position;
        currentLeftHandRotation = oldLeftHand.rotation;

    }

    void Update()
    {
        if (!isLocalPlayer)
        {
            return;
        }

        XROrigin xrOrigin = GetComponentInChildren<XROrigin>();
        Transform cameraOffset = xrOrigin.transform.Find("Camera Offset");

        currentHead = cameraOffset.Find("Main Camera");
        currentHeadPosition = currentHead.position;
        currentHeadRotation = currentHead.rotation;
        currentPosition = transform.position;
        currentRotation = transform.rotation;
        currentRightHand = cameraOffset.Find("Right Controller");
        currentRightHandPosition = currentRightHand.position;
        currentRightHandRotation = currentRightHand.rotation;
        currentLeftHand = cameraOffset.Find("Left Controller");
        currentLeftHandPosition = currentLeftHand.position;
        currentLeftHandRotation = currentLeftHand.rotation;

        if (currentHeadPosition != oldHeadPosition)
        {
            NetworkManager.instance.GetComponent<NetworkManager>().CommandHeadMove(currentHead.position);
            oldHeadPosition = currentHeadPosition;
        }

        if (currentHeadRotation != oldHeadRotation)
        {
            NetworkManager.instance.GetComponent<NetworkManager>().CommandHeadTurn(currentHead.rotation);
            oldHeadRotation = currentHeadRotation;
        }

        if (currentPosition != oldPosition)
        {
            NetworkManager.instance.GetComponent<NetworkManager>().CommandMove(transform.position);
            oldPosition = currentPosition;
        }

        if (currentRotation != oldRotation)
        {
            NetworkManager.instance.GetComponent<NetworkManager>().CommandTurn(transform.rotation);
            oldRotation = currentRotation;
        }

        if (currentRightHandPosition != oldRightHandPosition)
        {
            NetworkManager.instance.GetComponent<NetworkManager>().CommandRightHandMove(currentRightHand.position);
            oldRightHandPosition = currentRightHandPosition;
        }

        if (currentRightHandRotation != oldRightHandRotation)
        {
            NetworkManager.instance.GetComponent<NetworkManager>().CommandRightHandTurn(currentRightHand.rotation);
            oldRightHandRotation = currentRightHandRotation;
        }

        if (currentLeftHandPosition != oldLeftHandPosition)
        {
            NetworkManager.instance.GetComponent<NetworkManager>().CommandLeftHandMove(currentLeftHand.position);
            oldLeftHandPosition = currentLeftHandPosition;
        }

        if (currentLeftHandRotation != oldLeftHandRotation)
        {
            NetworkManager.instance.GetComponent<NetworkManager>().CommandLeftHandTurn(currentLeftHand.rotation);
            oldLeftHandRotation = currentLeftHandRotation;
        }

        // Forward move
        //if (Input.GetKey(KeyCode.W) || OVRInput.Get(OVRInput.Button.PrimaryThumbstickUp))
        //{
        //    var forward = currentHead.forward;
        //    forward.y = 0;
        //    transform.position += forward.normalized * Time.deltaTime;
        //}

        //// Back move
        //if (Input.GetKey(KeyCode.S) || OVRInput.Get(OVRInput.Button.PrimaryThumbstickDown))
        //{
        //    var forward = currentHead.forward;
        //    forward.y = 0;
        //    transform.position -= forward.normalized * Time.deltaTime;
        //}

        //// Left move
        //if (Input.GetKey(KeyCode.A) || OVRInput.Get(OVRInput.Button.PrimaryThumbstickLeft))
        //{
        //    var right = currentHead.right;
        //    right.y = 0;
        //    transform.position -= right.normalized * Time.deltaTime;
        //}
        //// Right move
        //if (Input.GetKey(KeyCode.D) || OVRInput.Get(OVRInput.Button.PrimaryThumbstickRight))
        //{
        //    var right = currentHead.right;
        //    right.y = 0;
        //    transform.position += right.normalized * Time.deltaTime;
        //}

        //// Left rotate
        //if (Input.GetKey(KeyCode.Q) || OVRInput.Get(OVRInput.Button.SecondaryThumbstickLeft))
        //{
        //    transform.Rotate(new Vector3(0, -Angle, 0));
        //}
        //// Right rotate
        //if (Input.GetKey(KeyCode.E) || OVRInput.Get(OVRInput.Button.SecondaryThumbstickRight))
        //{
        //    transform.Rotate(new Vector3(0, Angle, 0));
        //}

    }
}
