import { Clock, DollarSign, Star } from 'lucide-react';
import styles from './ActivityMeta.module.css';

const ActivityMeta = ({ duration, cost, rating }) => {
  return (
    <div className={styles.container}>
      {duration && (
        <span className={styles.item}>
          <Clock size={14} />
          <span>{duration} min</span>
        </span>
      )}
      {cost !== undefined && (
        <span className={styles.item}>
          <DollarSign size={14} />
          <span>${cost}</span>
        </span>
      )}
      {rating && (
        <span className={styles.item}>
          <Star size={14} />
          <span>{rating}</span>
        </span>
      )}
    </div>
  );
};

export default ActivityMeta;


