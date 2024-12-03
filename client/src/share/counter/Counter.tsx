import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import "src/share/counter/Counter.scss";

type CounterProps = {
    timer: number;
    setReset: Dispatch<SetStateAction<boolean>>;
};

const Counter: React.FC<CounterProps> = ({ timer: timer, setReset: setReset }) => {
    const [time, setTime] = useState(timer);

    useEffect(() => {
        if (time === 0) return;

        const counter = setInterval(() => {
            setTime(time - 1);
        }, 1000);

        return () => clearInterval(counter);
    }, [time]);

    return (
        <>
           
                {time === 0 ? (
                    <button className="counter btn-counter" onClick={(evt) => {
                        setTime(timer);
                        setReset(true);
                    }}>
                        Gửi
                    </button>
                ) : (
                    <div className="counter clock">{time}</div>
                )}
           
        </>
    );
};

export default Counter;
