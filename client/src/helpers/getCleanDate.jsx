const getCleanDate = (oldDate) => {
    const dateObj = new Date(oldDate)
    const formattedDateSlash = dateObj.toLocaleDateString('en-AU');   
    return formattedDateSlash.replace('-', '/');  
}

export default getCleanDate;