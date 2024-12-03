import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import { RootState } from "src/app/store";
import { registerActions } from "src/redux/reducer/register/Register";
import RegisterForm, { registerData } from "src/share/form/RegisterForm";
import Verify from "src/share/verify/Verify";
import "src/components/register/Register.scss";

interface RegisterProps {}

const Register: React.FC<RegisterProps> = () => {
    const [info, setInfo] = useState<registerData>({
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        nation: "",
        confirmPassword: "",
        avatar: "",
    });
    const [nextStep, setNextStep] = useState<number>(1);
    const verifyToken = useAppSelector((state: RootState) => state.registerReducer.verifyToken);
    const dispatch = useAppDispatch();
    const nav = useNavigate();
    const [params] = useSearchParams();

    const verifyFormHandle = (data: any): void => {
        setInfo(data);
        setNextStep((prev) => prev + 1);
    };

    const verifyEmail = (email: string): void => {
        dispatch(registerActions.reqSendDataVerify({ emailVerify: email }));
    };

    const submitHandler = (): void => {
        dispatch(
            registerActions.reqSendDataRegister({
                information: info,
            }),
        );
    };

    useEffect(() => {
        nav(`/register?step=${nextStep}`);
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
            {/* <div>
                <div className="register__process" style={{ backgroundColor: "red" }}>
                    <div className="process node">A</div>
                    <div className="process line"></div>
                    <div className="process node">B</div>
                    <div className="process line"></div>
                    <div className="process node">C</div>
                </div>
            </div> */}
            <div className="register__container">
                {!(nextStep === 1) ? (
                    <RegisterForm registerData={info} onSubmit={verifyFormHandle} />
                ) : (
                    <Verify
                        email={info.email}
                        verifyToken={verifyToken}
                        information={info}
                        setNextStep={setNextStep}
                        verify={verifyEmail}
                        handler={submitHandler}
                    />
                )}
            </div>
        </>
    );
};

export default Register;
