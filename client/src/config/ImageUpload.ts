import {
  ref,
  uploadString,
  getDownloadURL,
  getStorage,
} from "firebase/storage";

const uploadImage = async (file: any, userID: any) => {
  const storage = getStorage();

  try {
    const storageRef = ref(storage, `images/${userID}/${file.name}`);
    const dataURL = await readFileAsDataURL(file);

    if(typeof dataURL === "string"){
        const matches = dataURL.match(/^data:(.*?);base64,/);

        if(matches && matches.length > 1) {
            const mimeType = matches[1];
            await uploadString(storageRef, dataURL, "data_url", {contentType: mimeType});
            const imageUrl = await getDownloadURL(storageRef);
            return imageUrl;
        }else{
            console.log("Không hợp lệ");
            throw new Error("Không hợp lệ")
        }
    }else {
        throw new Error("dataURL is not a string.");
    }
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

const readFileAsDataURL = (file:any) => {
    return new Promise((resolve:any , reject:any ) => {
        const reader = new FileReader()
        reader.onload = (evt:any) => {
            resolve(evt.target.result);
        };
        reader.onerror = (error:any) => {
            reject(error);
        }
        reader.readAsDataURL(file);
    })
}

export default uploadImage;
