export const getImageUrl = (collectionId, recordId, fileName, size = '0x0') => {
    return `https://pb.charlesparames.com/api/files/${collectionId}/${recordId}/${fileName}?thumb=${size}`;
};

export const validateData = async (formData, schema) => {
    const body = Object.fromEntries(formData);
    try {
        const data = schema.parse(body);
        return {
            formData: data,
            errors: null
        }
    }catch(err) {
        const errors = err.flatten();
        return {
            formData: body,
            errors
        }
    }
}
