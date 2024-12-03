import React, { useState } from "react";
import { collection, query, where, doc, getDoc, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "src/config/FirebaseConfig";

type Props = {
    _collection: string;
    _id: string;
};

const useDocument = (props: Props) => {
    const [documents, setDocuments] = useState<any>([]);
    const { _collection, _id } = props;

    React.useEffect(() => {
        if (_id === "") return;

        const unsubcribe = onSnapshot(doc(db, _collection, _id), (doc) => {
            if (doc.exists()) {
                const document = Object.keys(doc.data()).map((key: string) => ({
                    data: doc.data()[key],
                    key: key,
                }));

                setDocuments(document);
            }
        });
        return unsubcribe;
    }, [_id]);

    return documents;
};

export default useDocument;
