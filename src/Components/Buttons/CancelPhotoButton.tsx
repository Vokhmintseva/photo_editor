import React from 'react';

interface CancelPhotoButtonProps {
    stopWebCam: () => void,
}

function CancelPhotoButton(props: CancelPhotoButtonProps) {
    
    function cancelPhotoButtonHandler() {
        props.stopWebCam();
    }   

    return (
        <button onClick={cancelPhotoButtonHandler}>Cancel</button>
    );
}    

export default CancelPhotoButton;