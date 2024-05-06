function Modal(props) {

    let modalSize = 'modal-dialog';

    if (props.modalSize) {
        modalSize += ' ' + props.modalSize;
    }

    return (
        <>
            <div class="modal" id={props.id} data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div class={modalSize}>
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="staticBackdropLabel">{props.title}</h1>
                            <button id='btnModalClose' type="button" class="btn-close btnClose" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            {props.children}
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default Modal;