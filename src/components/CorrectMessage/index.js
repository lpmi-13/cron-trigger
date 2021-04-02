const CorrectMessage = ({ active }) => {
    return (
        <div className={`congrats ${active ? '' : 'inactive'}`}>
           you got it right!
        </div>
    )
}

export default CorrectMessage;