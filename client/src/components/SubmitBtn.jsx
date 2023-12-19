import React from 'react'
import { useNavigation } from 'react-router-dom';

const SubmitBtn = ({formBtn}) => {
    const navigation = useNavigation();
    const isSubmitting = navigation.state === 'submitting';
    return (
        <button type="submit" className={`btn btn-block ${formBtn ? 'form-btn' : ''}`} disabled={isSubmitting}> {/* could also use ${formBtn && 'form-btn'} instead of ternary expr */}
            {isSubmitting ? 'submitting...' : 'submit'}
        </button>
    )
}

export default SubmitBtn