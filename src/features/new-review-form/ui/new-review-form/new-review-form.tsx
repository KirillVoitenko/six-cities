import { ChangeEventHandler, useEffect } from 'react';
import { RATING_INPUTS_CONFIG, INITIAL_STATE } from './consts';
import { NewReviewData } from '@entities/review';
import { useValidate, ValidationConfig } from '@shared/hooks/use-validation';
import classNames from 'classnames';
import { useForm } from '@shared/hooks/use-form';
import { REVIEW_LENGTH, RATING_LENGTH } from '@features/new-review-form/config';
import { RatingInput } from '../rating-input';
import { RatingValue } from '@shared/types';

type NewReviewFormProps = {
  onSubmit: (reviewData: NewReviewData) => Promise<void>;
}

const validationScheme: ValidationConfig<NewReviewData> = {
  rating: [
    {
      rule: (value) => value >= RATING_LENGTH.MIN && value <= RATING_LENGTH.MAX,
      errorMessage: `Rate from ${RATING_LENGTH.MIN} to ${RATING_LENGTH.MAX} stars`
    }
  ],
  review: [
    {
      rule: (value) => value.length >= REVIEW_LENGTH.MIN,
      errorMessage: `Minimal review length - ${REVIEW_LENGTH.MIN} symbols`
    },
    {
      rule: (value) => value.length <= REVIEW_LENGTH.MAX,
      errorMessage: `Maximal review length - ${REVIEW_LENGTH.MAX} symbols`
    }
  ]
};

export function NewReviewForm({ onSubmit }: NewReviewFormProps): JSX.Element {
  const {
    getFieldValue,
    handleSubmit,
    setFieldValue,
    reset,
    isSubmitting
  } = useForm(INITIAL_STATE);

  const {
    validationResult: { validations, isValid },
    validateField,
    resetValidation,
    validateAll
  } = useValidate<NewReviewData>(validationScheme);

  const formSubmitHandler = (data: NewReviewData) => {
    validateAll(data);

    if (isValid) {
      onSubmit(data);
      reset();
      resetValidation();
    }
  };

  useEffect(
    () => {
      let componentIsMounted = true;

      if (componentIsMounted) {
        validateField(getFieldValue('rating'), 'rating');
      }
      return () => {
        componentIsMounted = false;
      };
    },
    [validateField, getFieldValue]
  );

  const ratingContainerClassName = classNames(
    'reviews__rating-form',
    'form__rating',
    { ['error']: validations?.rating?.isNotValid }
  );

  const reviewInputClassName = classNames(
    'reviews__textarea',
    'form__textarea',
    { ['error']: validations?.review?.isNotValid }
  );

  const reviewDataChangeHandler = <TKey extends keyof NewReviewData>(controllerName: TKey, value: NewReviewData[TKey]): void => {
    setFieldValue(controllerName, value);
    validateField(value, controllerName);
  };

  const onReviewChange: ChangeEventHandler<HTMLTextAreaElement> = (event) => reviewDataChangeHandler('review', event.target.value);
  const onRatingChange = (rating: RatingValue) => reviewDataChangeHandler('rating', rating);

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form className='reviews__form form' action='#' method='post' onSubmit={handleSubmit(formSubmitHandler)} data-testid='new-review-form-element'>
      <label className='reviews__label form__label' htmlFor='review'>Your review</label>
      <div className={ratingContainerClassName}>
        {RATING_INPUTS_CONFIG.map((current) => (
          <RatingInput
            key={`rating-input-${current.value}`}
            onChangeRating={onRatingChange}
            checked={current.value <= getFieldValue('rating')}
            {...current}
          />
        ))}
      </div>
      {validations?.rating?.isNotValid && <small className='error-message'>{validations.rating?.message}</small>}
      <textarea
        className={reviewInputClassName}
        id='review'
        name='review'
        placeholder='Tell how was your stay, what you like and what can be improved'
        value={getFieldValue('review')}
        onChange={onReviewChange}
      />
      {validations?.review?.isNotValid && <small className='error-message'>{validations.review?.message}</small>}
      <div className='reviews__button-wrapper'>
        <p className='reviews__help'>
          To submit review please make sure to set <span className='reviews__star'>rating</span> and describe your stay with at least <b className='reviews__text-amount'>{REVIEW_LENGTH.MIN} characters</b>.
        </p>
        <button className='reviews__submit form__submit button' type='submit' disabled={!(isValid || isSubmitting)}>Submit</button>
      </div>
    </form>
  );
}
