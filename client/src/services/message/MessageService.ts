import React from "react";
import { doc, setDoc, updateDoc, serverTimestamp, collection, getDoc } from "firebase/firestore";
import { db } from "src/config/FirebaseConfig";

export const MessageService = {
    get: async (_collection: string, _id: string) => {
        try {
            const docRef = doc(db, _collection, _id);
            const data = await getDoc(docRef);
            return data;
        } catch (error) {
            console.log(error);
        }
    },
    add: async (_collection: string, _data: any) => {
        try {
            const ref = doc(collection(db, _collection));
            await setDoc(ref, {
                ..._data,
                createdAt: serverTimestamp(),
            });
        } catch (error) {
            console.log(error);
        }
    },
    addWithId: async (_collection: string, _id: string, _data: any) => {
        try {
            const ref = doc(db, _collection, _id);
            const docRef = await setDoc(
                ref,
                {
                    ..._data,
                },
                {
                    merge: true,
                },
            );

            return true;
        } catch (error) {
            return false;
        }
    },
    update: async (_collection: string, id: string, _data: any) => {
        console.log(_data);
        try {
            await updateDoc(doc(db, _collection, id), _data);
        } catch (error) {
            return null;
        }
    },
};

export default MessageService;
