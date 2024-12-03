import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import { RootState } from "src/app/store";
import { registerActions } from "src/redux/reducer/register/Register";
import ChangePasswordForm from "src/share/form/ChangePasswordForm";
import Verify from "src/share/verify/Verify";
import "src/components/forget/ForgetPassword.scss";


interface ForgetPasswordProps {}

const ForgetPassword: React.FC<ForgetPasswordProps> = () => {
    const [nextStep, setNextStep] = useState<number>(1);
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState();
    const verifyToken = useAppSelector((state: RootState) => state.registerReducer.verifyToken);
    const dispatch = useAppDispatch();
    const nav = useNavigate();
    const [params] = useSearchParams();

    const verifyEmail = (email: string): void => {
        dispatch(registerActions.reqSendDataVerify({ emailVerify: email }));
    };

    const verifyHandler = (e: { preventDefault: () => void }) => {
        setNextStep((prev) => prev + 1);
    };

    const resetPasswordHandler = (data: any) => {
        setNewPassword(data.password);
        setNextStep((prev) => prev + 1);
    };

    const submitHandler = () => {
        dispatch(registerActions.reqChangePassword({ emailReset: email, passwordReset: newPassword }));
    };

    useEffect(() => {
        nav(`/forget?step=${nextStep}`);
    }, [nextStep]);

    useEffect(() => {
        const num = params.get("step");
        if (num !== null) {
            const step = Number(num);
            if (!isNaN(step)) setNextStep(step);
        }
    }, []);

    return (
        <>
            <div className="forget-container">
                {nextStep === 1 && (
                    <>
                        <div className="forget-title">Đặt lại mặt khẩu</div>
                        <form className="form">
                            <input
                                type="email"
                                className="input"
                                placeholder="Email xác nhận"
                                onChange={(evt) => setEmail(evt.target.value)}
                            />
                            <button className="btn" onClick={verifyHandler}>
                                Xác nhận
                            </button>
                        </form>
                    </>
                )}
                {nextStep === 2 && <ChangePasswordForm onSubmit={resetPasswordHandler} />}
            </div>
            {nextStep === 3 && (
                <>
                    <Verify
                        handler={submitHandler}
                        email={email}
                        verifyToken={verifyToken}
                        verify={verifyEmail}
                        setNextStep={setNextStep}
                    />
                </>
            )}
        </>
    );
};

export default ForgetPassword;
