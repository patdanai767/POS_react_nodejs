import Navbar from "./Navbar";
import SideBar from "./Sidebar";
import { forwardRef, useImperativeHandle } from 'react';
import { useRef } from 'react';

const Template = forwardRef((props, ref) => {
    useImperativeHandle(ref, () => ({
        refreshCountBill(){
            if(templateRef.current){
                templateRef.current.refreshCountBill();
            }
        }
    }));

    const templateRef = useRef();

    return (
        <>
        <div className='wrapper'>
            <Navbar />
            <SideBar ref={templateRef}/>

            <div className='content-wrapper pt-3'>
                <section className="content">
                    {props.children}
                </section>
            </div>
        </div>
        </>
    );
});

export default Template;