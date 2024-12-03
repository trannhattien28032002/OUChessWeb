import React, { Dispatch, useEffect, useState } from "react";
import jwt_decode, { JwtPayload } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "src/app/hooks";
import { RootState } from "src/app/store";
import Counter from "src/share/counter/Counter";
import "src/share/verify/Verify.scss";
import "src/components/login/Login.scss";
interface verifyProps {
    email: string;
    verifyToken?: string;
    information?: {
        username?: string;
        password?: string;
        firstName?: string;
        lastName?: string;
        dOb?: string;
        email?: string;
        phone?: string;
        nation?: string;
        // avatar: object;
    };
    setNextStep: Dispatch<React.SetStateAction<number>>;
    verify: (email: string) => void;
    handler: () => void;
}

interface verifyPayload extends JwtPayload {
    email: string;
    verifyCode: string;
}

const Verify: React.FC<verifyProps> = ({
    email: email,
    verifyToken: verifyToken,
    information: information,
    setNextStep: setNextStep,
    verify: verify,
    handler: handler,
}) => {
    const isLoading = useAppSelector((state: RootState) => state.registerReducer.isLoading);
    const [verifyCode, setVerifyCode] = useState("");
    const [isReset, setReset] = useState<boolean>(true);
    const [timer, setTimer] = useState<number>(60);
    const [error, setError] = useState<string>("");
    const nav = useNavigate();

    useEffect(() => {
        if (isReset) {
            verify(email);
            setReset(false);
        }
    }, [isReset]);

    const verifyToHandler = (e: { preventDefault: () => void }) => {
        e.preventDefault();
        console.log(verifyToken);
        if (verifyToken) {
            const decode: verifyPayload = jwt_decode<verifyPayload>(verifyToken);
            const exp = decode.exp || 0;
            if (exp !== 0 && exp > new Date().getTime() / 1000) {
                const vEmail = decode.email;
                const vCode = decode.verifyCode;
                if (email === vEmail && verifyCode === vCode) {
                    handler();
                    nav("/login");
                } else {
                    setError("Mã xác nhận không trùng khớp");
                }
            } else {
                setError("Mã xác nhận đã quá hạn");
            }
        }
    };

    return (
        <>
            <div className="verify-container">
                <div className="verify-title">XÁC NHẬN TÀI KHOẢN</div>

                <form className="verify-form" onSubmit={verifyToHandler}>
                    <div className="verify-input">
                        <div className="input__container">
                            <div className="textbox__container">
                                <input
                                    className="textbox__style"
                                    type="text"
                                    placeholder="Mã xác nhận"
                                    onChange={(evt) => setVerifyCode(evt.target.value)}
                                    onBlur={(evt) => setError("")}
                                />
                                {error !== "" && <div className="error-msg">{error}</div>}
                            </div>
                        </div>
                        <div className="verify__counter">
                            <Counter timer={timer} setReset={setReset} />
                        </div>
                    </div>

                    <button type="submit" className="btn__style btn__create">
                        Xác nhận
                    </button>
                </form>
                <div
                    style={{ margin: "10px auto", padding: "10px", textAlign: "center" }}
                    className="w-20 btn-form"
                    onClick={(evt) => {
                        setNextStep((prev) => prev - 1);
                    }}
                >
                    Trở về
                </div>
            </div>
        </>
    );
};

export default Verify;
