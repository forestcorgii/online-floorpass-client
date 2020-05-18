import React, { useState, useEffect, useContext } from 'react';
import { Button, Navbar, Col } from 'react-bootstrap';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';


import Util from './Util';
import API from './Api';
import General from './General'

import AuthContext from './AuthContext';
// import DataContext from './DataContext';

function Guard(props) {
    const { auth } = useContext(AuthContext);

    const headerInfo = {
        headers: ['ID', 'Supervisor', 'Employees', 'Location', 'Department', 'Logs', 'Purpose', 'Status'],
        subHeaders: { logs: 'logdatetime', employees: 'employee_name' }
    };

    const [state, setState] = useState({ logs: null, isLoading: true });
    const [referenceID, setReferenceID] = useState('');
    useEffect(() => {
        // API.callLogAPI().then(x => setState({ logs: x, isLoading: false }))
    }, [])

    const LogSchema = Yup.object().shape({
        ReferenceID: Yup.string()
            .required('required')
            .length(4, 'Invalid')
    })


    const handleSubmit =
        async () => {
            await API.createLog({ id: auth.id, floorpass_id: referenceID, location: auth.location })
        }

    return (
        <div>
            <General.Filter
                logs={state.logs}
                setLog={setState}
            >
                <Formik
                    initialValues={{
                        ReferenceID: 'sdsd'
                    }}
                    validationSchema={Yup.object().shape({
                        ReferenceID: Yup.string()
                            .required('required')
                            .length(4, 'Invalid')
                    })}
                    onSubmit={(values) => console.log(values)}
                >
                    {({ values, errors, touched }) => (
                        <Form>
                            <Field name="ReferenceID" />
                            {errors.ReferenceID && touched.ReferenceID ? (
                                <div>{errors.ReferenceID}</div>
                            ) : null}
                            <Button type="submit">Log</Button>
                        </Form>
                    )}
                </Formik>

                {/* <Form onSubmit={() => handleSubmit()}>
                    <Form.Row>
                        <Util.Text
                            name="referenceID"
                            placeholder="Reference ID"
                            onChange={e => setReferenceID(e.target.value)}
                        />
                        <Col>
                            <Button size="sm" type="submit">Log</Button>
                        </Col>
                    </Form.Row>
                </Form> */}
            </General.Filter>
            <Util.Log name="log"
                headerInfo={headerInfo}
                data={state}
            />
        </div>
    );


}

export default Guard;