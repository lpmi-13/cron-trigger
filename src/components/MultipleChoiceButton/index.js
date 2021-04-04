import { motion } from 'framer-motion';

const MultipleChoiceButton = ({ cronPhrase, onClick }) => {
    return (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={"multipleChoiceButton"}
          onClick={onClick}
          aria-label={cronPhrase}
          >
          {cronPhrase}
        </motion.button>
    )
}

export default MultipleChoiceButton;