import { Environment } from "@react-three/drei/core/Environment";
import { Canvas } from "@react-three/fiber";
import { motion } from "framer-motion-3d";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "src/components/tutorial/Tutorial.scss";
import Board from "src/interfaces/gamecore/board/Board";
import Move from "src/interfaces/gamecore/board/Move";
import { BoardModel } from "src/models/Board";
import { BoardDefault } from "src/share/gamecore/Board";
import Sidebar from "src/share/sidebar/Sidebar";
import { Vector3 } from "three";
import logo from "src/assets/images/chess-realm-logo-2.png";

type Props = {
    text?: string;
};

type Quest = {
    type: string;
    fen: string;
    move: string;
    isDone: boolean;
};

const lessons = [
    {
        lessonID: "1",
        title: "Cách di chuyển quân Tốt",
        bg: "",
        description: "Bài hướng dẫn về cách di chuyển cơ bản của quân Tốt",
        script: [
            {
                type: "line",
                content: "Đây là phần hướng dẫn cách di chuyển của quân Tốt(Pawn)",
            },
            {
                type: "line",
                content:
                    "Mỗi lần quân tốt di chuyển thẳng 1 ô. Nhưng ở lần đầu tiên di chuyển của quân tốt thì có thể di chuyển 2 ô.",
            },
            {
                type: "quest",
                questType: "move",
                fen: "4k3/8/8/8/8/8/4P3/4K3 w - - 0 1",
                move: "Pe4*Pe3",
                content: "Bây giờ, hãy di chuyển quân tốt có trên bàn.",
                isDone: false,
                endContent: "Hoàn hảo",
            },
            {
                type: "line",
                content: "Làm tốt lắm bạn đã nắm bắt được cách di chuyển của quân tốt.",
            },
        ],
    },
    {
        lessonID: "2",
        title: "Cách di chuyển quân mã",
        bg: "",
        description: "Bài hướng dẫn về cách di chuyển cơ bản của quân Mã",
        script: [
            {
                type: "line",
                content: "Đây là phần hướng dẫn cách di chuyển quân mã",
            },
            {
                type: "line",
                content: "Quân mã di chuyển theo hình chữ 'L' kể từ vị trí nó đứng ra mọi phía",
            },
            {
                type: "line",
                content: "Quân mã có thể di chuyển dù có quân cờ cùng màu chặn chúng.",
            },
            {
                type: "quest",
                questType: "move",
                fen: "rnbqkbnr/pppppppp/8/8/3N4/8/PPPPPPPP/RNBQKB1R w KQkq - 0 1",
                move: "Nb5*Nc6*Ne6*Nf5*Nb3*Nf3",
                content: "Bây giờ, hãy di chuyển quân mã trắng ở giữa bàn.",
                isDone: false,
                endContent: "Một nước đi đúng",
            },
            {
                type: "line",
                content: "Làm tốt lắm bạn đã nắm bắt được cách di chuyển của quân mã.",
            },
        ],
    },
    {
        lessonID: "3",
        title: "Cách di chuyển quân tượng",
        bg: "",
        description: "Bài hướng dẫn về cách di chuyển cơ bản của quân Tượng",
        script: [
            {
                type: "line",
                content: "Đây là phần hướng dẫn cách di chuyển quân tượng (Bishop).",
            },
            {
                type: "line",
                content: "Quân tượng di chuyển chéo theo bốn phía.",
            },
            {
                type: "quest",
                questType: "move",
                fen: "rnbqkbnr/pppppppp/8/8/2B5/4P3/PPPP1PPP/RNBQK1NR w KQkq - 0 1",
                move: "Ba6*Bb5*Bc4*Bd3*Be2*Bf1*Bb3*Bd5*Be6*Bxf7#",
                content: "Bây giờ, hãy di chuyển quân tượng trắng ở giữa bàn.",
                isDone: false,
                endContent: "Làm tốt lắm bạn đã nắm bắt được cách di chuyển của quân tượng.",
            },
            {
                type: "line",
                content: "Làm tốt lắm bạn đã nắm bắt được cách di chuyển của quân tượng.",
            },
        ],
    },
    {
        lessonID: "4",
        title: "Cách di chuyển quân xe",
        bg: "",
        description: "Bài hướng dẫn về cách di chuyển cơ bản của quân Xe",
        script: [
            {
                type: "line",
                content: "Đây là phần hướng dẫn cách di chuyển quân xe (Rook).",
            },
            {
                type: "line",
                content: "Quân tượng di chuyển thằng và ngang theo đường thẳng",
            },
            {
                type: "quest",
                questType: "move",
                fen: "rnbqkbnr/pppppppp/8/2R5/7P/8/PPPPPPP1/RNBQKBN1 w Qkq - 0 1",
                move: "Ra5*Rb5*Rd5*Re5*Rf5*Rg5*Rh5*Rc6*Rxc7*Rc4*Rc3",
                content: "Bây giờ, hãy di chuyển quân xe trắng ở giữa bàn.",
                isDone: false,
                endContent: "Làm tốt lắm bạn đã nắm bắt được cách di chuyển của quân xe.",
            },
            {
                type: "line",
                content: "Bạn đã hoàn thành bài hướng dẫn các để di chuyển quân xe.",
            },
        ],
    },
    {
        lessonID: "5",
        title: "Cách di chuyển quân hậu",
        bg: "",
        description: "Bài hướng dẫn về cách di chuyển cơ bản của quân Hậu",
        script: [
            {
                type: "line",
                content: "Đây là phần hướng dẫn cách di chuyển quân hậu (Queen).",
            },
            {
                type: "line",
                content:
                    "Quân hậu là quân cờ có thể di chuyển theo mọi hướng, là sự kết hợp của quân tượng và quân xe.",
            },
            {
                type: "quest",
                questType: "move",
                fen: "rnbqkbnr/pppppppp/8/8/3Q4/8/PPPPPPPP/RNB1KBNR w KQkq - 0 1",
                move: "Qc3*Qd3*Qe3*Qa4*Qb4*Qc4*Qd4*Qe4*Qf4*Qg4*Qh4*Qc5*Qd5*Qe5*Qxa7*Qb6*Qe6*Qxe7*Qg6*Qxg7",
                content: "Bây giờ, hãy di chuyển quân hậu trắng ở giữa bàn.",
                isDone: false,
                endContent: "Làm tốt lắm bạn đã nắm bắt được cách di chuyển của quân hậu.",
            },
            {
                type: "line",
                content: "Bạn đã hoàn thành bài hướng dẫn các để di chuyển quân hậu",
            },
        ],
    },
    {
        lessonID: "6",
        title: "Cách di chuyển quân vua",
        description: "Bài hướng dẫn về cách di chuyển cơ bản của quân Vua",
        bg: "",
        script: [
            {
                type: "line",
                content: "Đây là phần hướng dẫn cách di chuyển quân vua (King).",
            },
            {
                type: "line",
                content: "Quân vua cũng có thể di chuyển theo mọi hướng nhưng chỉ có 1 ô.",
            },
            {
                type: "quest",
                questType: "move",
                fen: "rnbqkbnr/pppppppp/8/8/8/4K3/PPP3PP/RNBQ1BNR w kq - 0 1",
                move: "Kd2*Kd3*Kd4*Ke2*Ke4*Kf2*Kf3*Kf4",
                content: "Bây giờ, hãy di chuyển quân hậu trắng ở giữa bàn.",
                isDone: false,
                endContent: "Làm tốt lắm bạn đã nắm bắt được cách di chuyển của quân vua.",
            },
            {
                type: "line",
                content: "Bạn đã hoàn thành bài hướng dẫn các để di chuyển quân vua",
            },
        ],
    },
];

const Tutorial = (props: Props) => {
    const [lesson, setLesson] = useState<any>({
        piece: "",
        lesson: 0,
    });
    const [lineNo, SetLineNo] = useState<number>(-1);
    const [line, setLine] = useState<string>("");
    const [quest, setQuest] = useState<Quest | null>(null);
    const [board, setBoard] = useState<Board>(new Board());
    const [move, setMove] = useState<string>("");
    const [script, setScript] = useState<any>();
    const nav = useNavigate();
    const params = useParams();
    const [cameraDefault, setCameraDefault] = useState(new Vector3(0, 0, 0));

    const handleTutorialLession = (piece: string, lesson: string) => {
        const str = piece.replaceAll(" ", "-");
        nav(`/tutorial/${lesson}/${str}`);
    };

    const handleLine = (no: number, isDone?: boolean) => {
        if (quest !== null) {
            if (!quest.isDone) {
                return;
            }
            console.log(script[no].endContent);
            setLine(script[no].endContent);
        }

        if (no < 0 || no > script.length - 1) {
            return;
        }

        if (lineNo !== no) {
            SetLineNo(no);

            const scp = script[no];
            setLine(scp.content);

            if (scp.type === "quest") {
                setQuest({
                    type: scp.questType || "",
                    fen: scp.fen || "",
                    move: scp.move || "",
                    isDone: scp.isDone || false,
                });

                if (scp.fen) {
                    const questBoard = new Board();
                    questBoard.LoadPositionByFen(scp.fen);
                    setBoard(questBoard);
                }
            } else {
                setQuest(null);
            }
        }
    };

    const getMoveRespone = (str: string) => {
        setMove(str || "");
    };

    useEffect(() => {
        const { title, id } = params;

        if (title === undefined || id === undefined) {
            setLesson({
                piece: "",
                lesson: 0,
            });
            return;
        }

        const _title = title.replaceAll("-", " ");

        setLesson({
            piece: title !== undefined ? _title : "",
            lesson: id !== undefined ? id : 0,
        });
        setScript(lessons.filter((l) => l.lessonID === id)[0].script);
        SetLineNo(-1);
        setLine("Xin chào người chơi");
    }, [params]);

    useEffect(() => {
        if (quest !== null) {
            if (quest.move) {
                const validMove = quest.move.split("*");
                console.log(move);
                if (validMove.includes(move)) {
                    setQuest({ ...quest, isDone: true });
                } else {
                    console.log("fail");
                }
            }
        }
    }, [move]);

    useEffect(() => {
        if (quest) {
            if (quest.isDone) {
                handleLine(lineNo);
            }
        }
    }, [quest]);

    return (
        <>
            {(lesson.piece === "" || lesson.id === 0) && (
                <>
                    <div className="lesson__container">
                        <div className="lesson__header">Hướng dẫn</div>

                        <div className="lesson__body">
                            {lesson.length !== 0 ? (
                                lessons.map((l) => {
                                    return (
                                        <>
                                            <div
                                                className="lesson__item"
                                                onClick={() => handleTutorialLession(`${l.title}`, `${l.lessonID}`)}
                                            >
                                                <div className="lesson__item__background">
                                                    <i className="fa-solid fa-book-bookmark"></i>
                                                </div>
                                                <div className="lesson__item__title">{l.title}</div>
                                                <div className="lesson__item__description">
                                                    {l.description}
                                                </div>
                                            </div>
                                        </>
                                    );
                                })
                            ) : (
                                <>
                                    <div>Chưa có bất kỳ hướng dẫn nào</div>
                                </>
                            )}
                        </div>
                    </div>
                </>
            )}

            {lesson.piece !== "" && lesson.id !== 0 && (
                <>
                    <div className="tutorial__container">
                        <div className="tutorial__content">
                            <div className="tutorial__board">
                                <>
                                    <Canvas shadows camera={{ position: cameraDefault, fov: 70 }}>
                                        <Environment files="/dawn.hdr" />
                                        {quest !== null && (
                                            <>
                                                <BoardModel />
                                                <BoardDefault
                                                    board={board}
                                                    setBoard={setBoard}
                                                    setMove={getMoveRespone}
                                                />
                                            </>
                                        )}
                                    </Canvas>
                                </>
                            </div>
                            <div className="tutorial__conservation">
                                <div className="conservation__header">{`${lesson.piece}`.toUpperCase()}</div>
                                <div className="conservation__content">
                                    {line !== "" && (
                                        <motion.span
                                            style={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.25, deplay: 0.1 }}
                                        >
                                            {line}
                                        </motion.span>
                                    )}
                                </div>
                                <div className="conservation__footer">
                                    {lineNo < script.length - 1 ? (
                                        <>
                                            <div
                                                onClick={() => handleLine(lineNo - 1)}
                                                className="btn__style btn__create w-30"
                                            >
                                                Quay lại
                                            </div>
                                            <div
                                                onClick={() => handleLine(lineNo + 1)}
                                                className="btn__style btn__create w-30"
                                            >
                                                Tiếp theo
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div
                                                onClick={() => nav("/tutorial")}
                                                className="btn__style btn__create w-30"
                                            >
                                                Hoàn thành
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div
                                    className="quit"
                                    onClick={() => {
                                        nav("/tutorial");
                                    }}
                                >
                                    Thoát Khỏi Bài Hướng Dẫn
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default Tutorial;
