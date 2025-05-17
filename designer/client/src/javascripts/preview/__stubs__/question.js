export const listItemsHTML = `<div class="govuk-form-group" id="list-items">
  <h2 class="govuk-heading-m" tabindex="-1">
    <svg class="govuk-!-margin-right-1" style="position: relative; top: -1px; vertical-align: middle;" width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="11" fill="currentColor"></circle>
      <path d="M6 8h12M6 12h12M6 16h12" stroke="white" stroke-width="2" stroke-linecap="round"></path>
    </svg>
    List items
  </h2>
  <hr class="govuk-section-break govuk-section-break--m govuk-section-break--visible"
      style="border-color:black; border-width: 3px;">

  <input type="hidden" name="listItemsData" id="radio-options-data" value="[{&quot;id&quot;:&quot;879e1a76-e110-44a5-840d-3866f50b5fd6&quot;,&quot;text&quot;:&quot;Treasure Hunting&quot;,&quot;value&quot;:&quot;Treasure Hunting&quot;},{&quot;id&quot;:&quot;801385a4-81e6-4171-96c3-6c6727d97f22&quot;,&quot;text&quot;:&quot;Rescuing the princess&quot;,&quot;value&quot;:&quot;Rescuing the princess&quot;},{&quot;id&quot;:&quot;e6e3f621-b875-4ca3-a054-cca9149149dd&quot;,&quot;text&quot;:&quot;Saving a city&quot;,&quot;value&quot;:&quot;Saving a city&quot;},{&quot;id&quot;:&quot;d71b3909-582f-4e90-b6f5-490b89a6eb8f&quot;,&quot;text&quot;:&quot;Defeating the baron&quot;,&quot;value&quot;:&quot;Defeating the baron&quot;}]">

  <ol class="app-reorderable-list js-enabled" id="options-container" data-module="reorderable-list">
    <li class="app-reorderable-list__item" data-index="1" data-id="414d82a3-4cab-416a-bd54-6b86fbd51120" data-val="Treasure Hunting" data-text="Treasure Hunting" data-hint="">
      <div class="app-reorderable-list__wrapper">
        <div class="app-reorderable-list__content">

            <div id="add-option-form" class="govuk-!-margin-bottom-6 app-reorderable-list__item" style="display:block" data-index="1" data-id="414d82a3-4cab-416a-bd54-6b86fbd51120" data-val="Treasure Hunting" data-hint="" data-text="Treasure Hunting">
              <h2 class="govuk-caption-m" id="add-option-heading">Item 1</h2>
              <div class="govuk-form-group">
              <label class="govuk-label govuk-label--m" for="radioText">
                Item
              </label>
              <input class="govuk-input" id="radioText" name="radioText" type="text" value="Treasure Hunting">
            </div>


              <div class="govuk-form-group">
              <label class="govuk-label govuk-label--m" for="radioHint">
                Hint text (optional)
              </label>
              <div id="radioHint-hint" class="govuk-hint">
                Use single short sentence without a full stop
              </div>
              <input class="govuk-input" id="radioHint" name="radioHint" type="text" value="" aria-describedby="radioHint-hint">
            </div>


              <input type="hidden" id="radioId" name="radioId" value="414d82a3-4cab-416a-bd54-6b86fbd51120">
              <!-- Advanced Features Section -->
              <details class="govuk-details" data-module="govuk-details" open="">
                <summary class="govuk-details__summary">
                  <span class="govuk-details__summary-text">Advanced
                    features</span>
                </summary>
                <div class="govuk-details__text">
                  <!-- Additional Value -->
                  <div class="govuk-form-group">
                    <div class="govuk-form-group">
              <label class="govuk-label govuk-label--m" for="radioValue">
                Unique identifier (optional)
              </label>
              <div id="radioValue-hint" class="govuk-hint">
                Used in databases to identify the item
              </div>
              <input class="govuk-input" id="radioValue" name="radioValue" type="text" value="Treasure Hunting" aria-describedby="radioValue-hint">
            </div>

                  </div>
                </div>
              </details>

              <div class="govuk-button-group">
                <button type="submit" class="govuk-button" id="save-new-option" name="enhancedAction" value="save-item">Save item</button>
                <a class="govuk-link govuk-link--no-visited-state" href="?action=cancel" id="cancel-add-option">Cancel</a>
              </div>
            </div>
        </div>

        <div class="edit-item">
          <ul class="govuk-summary-list__actions-list">
            <li class="govuk-summary-list__actions-list-item">
              <a class="govuk-link govuk-link--no-visited-state edit-option-link" href="?action=edit&amp;id=414d82a3-4cab-416a-bd54-6b86fbd51120">
                Edit<span class="govuk-visually-hidden">option 1</span>
              </a>
            </li>
            <li class="govuk-summary-list__actions-list-item">
              <a class="govuk-link govuk-link--no-visited-state govuk-link--destructive delete-option-link" href="?action=delete&amp;id=414d82a3-4cab-416a-bd54-6b86fbd51120">
                Delete<span class="govuk-visually-hidden"> list item</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </li>
    <li class="app-reorderable-list__item" data-index="2" data-id="801385a4-81e6-4171-96c3-6c6727d97f22"
        data-val="Rescuing the princess" data-text="Rescuing the princess">
      <div class="app-reorderable-list__wrapper">
        <div class="app-reorderable-list__content">
          <p class="govuk-body fauxlabel option-label-display" id="option-2-label-display">
            Rescuing the princess
          </p>
        </div>
        <div class="app-reorderable-list__actions">
          <button class="app-button govuk-button govuk-button--secondary js-reorderable-list-up" type="button"
                  aria-label="Move option up">Up
          </button>
          <button class="app-button govuk-button govuk-button--secondary js-reorderable-list-down"
                  type="button" aria-label="Move option down">Down
          </button>
        </div>
        <div class="edit-item">
          <ul class="govuk-summary-list__actions-list">
            <li class="govuk-summary-list__actions-list-item">
              <a class="govuk-link govuk-link--no-visited-state edit-option-link" href="?action=edit&amp;id=801385a4-81e6-4171-96c3-6c6727d97f22">
                Edit<span class="govuk-visually-hidden">option 2</span>
              </a>
            </li>
            <li class="govuk-summary-list__actions-list-item">
              <a class="govuk-link govuk-link--destructive delete-option-link" href="?action=delete&amp;id=801385a4-81e6-4171-96c3-6c6727d97f22">
                Delete<span class="govuk-visually-hidden"> list item</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </li>
    <li class="app-reorderable-list__item" data-index="3" data-id="e6e3f621-b875-4ca3-a054-cca9149149dd"
        data-val="Saving a city" data-text="Saving a city">
      <div class="app-reorderable-list__wrapper">
        <div class="app-reorderable-list__content">
          <p class="govuk-body fauxlabel option-label-display" id="option-3-label-display">
            Saving a city
          </p>
        </div>
        <div class="app-reorderable-list__actions">
          <button class="app-button govuk-button govuk-button--secondary js-reorderable-list-up" type="button"
                  aria-label="Move option up">Up
          </button>
          <button class="app-button govuk-button govuk-button--secondary js-reorderable-list-down"
                  type="button" aria-label="Move option down">Down
          </button>
        </div>
        <div class="edit-item">
          <ul class="govuk-summary-list__actions-list">
            <li class="govuk-summary-list__actions-list-item">
              <a class="govuk-link govuk-link--no-visited-state edit-option-link" href="?action=edit&amp;id=e6e3f621-b875-4ca3-a054-cca9149149dd">
                Edit<span class="govuk-visually-hidden">option 3</span>
              </a>
            </li>
            <li class="govuk-summary-list__actions-list-item">
              <a class="govuk-link govuk-link--destructive delete-option-link" href="?action=delete&amp;id=e6e3f621-b875-4ca3-a054-cca9149149dd">
                Delete<span class="govuk-visually-hidden"> list item</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </li>
    <li class="app-reorderable-list__item" data-index="4" data-id="d71b3909-582f-4e90-b6f5-490b89a6eb8f"
        data-val="Defeating the baron" data-text="Defeating the baron">
      <div class="app-reorderable-list__wrapper">
        <div class="app-reorderable-list__content">
          <p class="govuk-body fauxlabel option-label-display" id="option-4-label-display">
            Defeating the baron
          </p>
        </div>
        <div class="app-reorderable-list__actions">
          <button class="app-button govuk-button govuk-button--secondary js-reorderable-list-up" type="button"
                  aria-label="Move option up">Up
          </button>
          <button class="app-button govuk-button govuk-button--secondary js-reorderable-list-down"
                  type="button" aria-label="Move option down">Down
          </button>
        </div>
        <div class="edit-item">
          <ul class="govuk-summary-list__actions-list">
            <li class="govuk-summary-list__actions-list-item">
              <a class="govuk-link govuk-link--no-visited-state edit-option-link" href="?action=edit&amp;id=d71b3909-582f-4e90-b6f5-490b89a6eb8f">
                Edit<span class="govuk-visually-hidden">option 4</span>
              </a>
            </li>
            <li class="govuk-summary-list__actions-list-item">
              <a class="govuk-link govuk-link--destructive delete-option-link" href="?action=delete&amp;id=d71b3909-582f-4e90-b6f5-490b89a6eb8f">
                Delete<span class="govuk-visually-hidden"> list item</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </li>
  </ol>
</div>`

/**
 * @param {string} listItemsHTML
 * @returns {string}
 */
export function questionDetailsLeftPanelBuilder(listItemsHTML) {
  return `
<div class="govuk-summary-card__content">
  <div class="editor-card-title">Question 1</div>
  <div class="govuk-!-padding-top-3">

    <span class="govuk-caption-l">Page 2</span>

    <h1 class="govuk-heading-l" id="page-heading">Edit question 1</h1>

    <form class="form" method="post" id="question-form">
      <div class="govuk-form-group">
        <div class="govuk-form-group">
          <label class="govuk-label govuk-label--m" for="question">
            Question
          </label>
          <input class="govuk-input" id="question" name="question" type="text" value="Which quest would you like to pick?">
        </div>

        <div class="govuk-form-group">
          <label class="govuk-label govuk-label--m" for="hintText">
            Hint text (optional)
          </label>
          <textarea class="govuk-textarea" id="hintText" name="hintText" rows="3">Choose one adventure that best suits you.</textarea>
        </div>

        <div class="govuk-form-group">
          <div class="govuk-checkboxes govuk-checkboxes--small" data-module="govuk-checkboxes" data-govuk-checkboxes-init="">
            <div class="govuk-checkboxes__item">
              <input class="govuk-checkboxes__input" id="questionOptional" name="questionOptional" type="checkbox" value="true">
              <label class="govuk-label govuk-checkboxes__label" for="questionOptional">
                Make this question optional
              </label>
            </div>
          </div>
        </div>

        <div class="govuk-form-group">
          <label class="govuk-label govuk-label--m" for="shortDescription">
            Short description
          </label>
          <div id="shortDescription-hint" class="govuk-hint">
            Enter a short description for this question like 'Licence period'. Short descriptions are used in error
            messages and on the check your answers page.
          </div>
          <input class="govuk-input" id="shortDescription" name="shortDescription" type="text" value="your quest" aria-describedby="shortDescription-hint">
        </div>


        ${listItemsHTML}


        <input type="hidden" name="questionType" id="questionType" value="RadiosField">
        <input type="hidden" name="name" id="name" value="EfJgUy">
        <input type="hidden" name="list" id="list" value="yzMlel">
        <input type="hidden" name="jsEnabled" id="jsEnabled" value="false">
      </div>
      <a
        href="/error-preview/draft/form-to-go-live/pick-your-quest/f8da282b-3d6f-4175-9168-8977de18862a"
        role="button" target="_blank" id="preview-error-messages" draggable="false"
        class="govuk-button govuk-button--inverse" data-module="govuk-button" data-govuk-button-init="">
        <span class="icon-wrapper">
          <!-- Your SVG icon -->
          <svg width="24" height="17" viewBox="0 0 24 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M23.42 8.57175L23.4145 8.58481L23.4097 8.59816C23.3429 8.78328 23.238 9.00239 23.0886 9.2573C22.9298 9.52824 22.7228 9.87643 22.4673 10.3023C22.2277 10.7014 21.9331 11.1051 21.5814 11.5128C21.2252 11.9258 20.8204 12.3494 20.3664 12.7835C19.9256 13.205 19.4124 13.6141 18.8247 14.01C18.244 14.4012 17.6245 14.7357 16.9657 15.0134C16.3098 15.29 15.5465 15.5293 14.6726 15.729C13.8178 15.9244 12.9302 16.0145 12.0089 15.9981C11.0758 15.9815 10.1762 15.8904 9.30954 15.7253C8.44417 15.5605 7.70002 15.3321 7.07186 15.045C6.42176 14.7479 5.78632 14.4008 5.1655 14.0035C4.54798 13.6084 4.04112 13.2115 3.63933 12.8147C3.21885 12.3994 2.81352 11.9589 2.42339 11.4929C2.03009 11.023 1.7314 10.6298 1.52201 10.3108C1.30821 9.98506 1.10923 9.64233 0.92516 9.28242C0.730757 8.9023 0.621902 8.67581 0.583944 8.58135C0.571792 8.55111 0.559969 8.52204 0.548485 8.49418L0.556069 8.478C0.680152 8.28917 0.809181 8.00974 0.943944 7.67437C1.06885 7.36354 1.25291 7.0437 1.50227 6.71517C1.77608 6.35442 2.08956 5.93435 2.44256 5.45519C2.77046 5.01009 3.15984 4.59421 3.61254 4.20795C4.08069 3.80851 4.60573 3.39882 5.18832 2.97899C5.74736 2.57613 6.36096 2.23646 7.0305 1.96057C7.70215 1.6838 8.46464 1.45309 9.32031 1.27056C10.1633 1.09076 11.0561 1 12 1C12.9439 1 13.8367 1.09076 14.6797 1.27056C15.5349 1.45299 16.2879 1.68332 16.9417 1.959C17.5985 2.23593 18.2251 2.57814 18.8218 2.9861C19.4309 3.40252 19.9476 3.80621 20.3746 4.19663C20.8036 4.58877 21.2021 5.01376 21.5703 5.47185C21.9486 5.94264 22.2512 6.3486 22.4806 6.6911C22.7091 7.03241 22.9058 7.37151 23.0712 7.70836C23.2466 8.0655 23.3704 8.31228 23.4393 8.44078C23.4466 8.45441 23.4533 8.46723 23.4594 8.47928L23.42 8.57175ZM9.53856 8.98622H12H13.1542L12.3647 8.14422L10.5845 6.24555C11.0023 5.89618 11.459 5.75365 11.9687 5.78563C12.6631 5.82919 13.2545 6.09335 13.762 6.59079C14.2469 7.066 14.5 7.6826 14.5 8.48622C14.5 9.28973 14.2467 9.91814 13.7569 10.4124C13.2531 10.9206 12.6715 11.1717 11.9895 11.1859C11.3247 11.1998 10.7544 10.9573 10.2527 10.4223C9.86397 10.0077 9.62632 9.53328 9.53856 8.98622ZM8.44014 4.76879C7.4897 5.80124 7.01332 7.0475 7.012 8.48028C6.97841 9.95273 7.45622 11.2176 8.44952 12.2392C9.43354 13.2512 10.6222 13.7794 11.9931 13.7984C13.3754 13.8175 14.5714 13.2835 15.5567 12.2326C16.5414 11.1824 17.0295 9.92278 17.012 8.48013C16.9945 7.04689 16.5101 5.80106 15.5599 4.76879C14.6022 3.72848 13.4053 3.19961 12 3.19961C10.5947 3.19961 9.39782 3.72848 8.44014 4.76879Z"
                fill="#1D70B8" stroke="black"></path>
          </svg>
        </span>
        <span class="button-text">Preview error messages</span>
      </a>

      <hr class="govuk-section-break govuk-section-break--m govuk-section-break--visible">
      <h2 class="govuk-heading-m">Question settings</h2>

      <dl class="govuk-summary-list">
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            Type of information
          </dt>
          <dd class="govuk-summary-list__value">
            List: radios
          </dd>
          <dd class="govuk-summary-list__actions">
            <a class="govuk-link govuk-link--no-visited-state" href="/library/form-to-go-live/editor-v2/page/b07e7a93-a5eb-49b4-9005-e7e5cc179ee8/question/f8da282b-3d6f-4175-9168-8977de18862a/type/TbfMkP">Change<span
              class="govuk-visually-hidden"> type of question</span></a>
          </dd>
        </div>
      </dl>

      <hr class="govuk-section-break govuk-section-break--m govuk-section-break--visible">

      <div class="govuk-button-group govuk-!-margin-top-6">
        <a class="govuk-button govuk-button--inverse" data-module="govuk-button" href="/preview/draft/form-to-go-live/pick-your-quest?force" id="preview-page" role="button" target="_blank">
          <span class="icon-wrapper">
            <!-- Your SVG icon -->
            <svg width="24" height="17" viewBox="0 0 24 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M23.42 8.57175L23.4145 8.58481L23.4097 8.59816C23.3429 8.78328 23.238 9.00239 23.0886 9.2573C22.9298 9.52824 22.7228 9.87643 22.4673 10.3023C22.2277 10.7014 21.9331 11.1051 21.5814 11.5128C21.2252 11.9258 20.8204 12.3494 20.3664 12.7835C19.9256 13.205 19.4124 13.6141 18.8247 14.01C18.244 14.4012 17.6245 14.7357 16.9657 15.0134C16.3098 15.29 15.5465 15.5293 14.6726 15.729C13.8178 15.9244 12.9302 16.0145 12.0089 15.9981C11.0758 15.9815 10.1762 15.8904 9.30954 15.7253C8.44417 15.5605 7.70002 15.3321 7.07186 15.045C6.42176 14.7479 5.78632 14.4008 5.1655 14.0035C4.54798 13.6084 4.04112 13.2115 3.63933 12.8147C3.21885 12.3994 2.81352 11.9589 2.42339 11.4929C2.03009 11.023 1.7314 10.6298 1.52201 10.3108C1.30821 9.98506 1.10923 9.64233 0.92516 9.28242C0.730757 8.9023 0.621902 8.67581 0.583944 8.58135C0.571792 8.55111 0.559969 8.52204 0.548485 8.49418L0.556069 8.478C0.680152 8.28917 0.809181 8.00974 0.943944 7.67437C1.06885 7.36354 1.25291 7.0437 1.50227 6.71517C1.77608 6.35442 2.08956 5.93435 2.44256 5.45519C2.77046 5.01009 3.15984 4.59421 3.61254 4.20795C4.08069 3.80851 4.60573 3.39882 5.18832 2.97899C5.74736 2.57613 6.36096 2.23646 7.0305 1.96057C7.70215 1.6838 8.46464 1.45309 9.32031 1.27056C10.1633 1.09076 11.0561 1 12 1C12.9439 1 13.8367 1.09076 14.6797 1.27056C15.5349 1.45299 16.2879 1.68332 16.9417 1.959C17.5985 2.23593 18.2251 2.57814 18.8218 2.9861C19.4309 3.40252 19.9476 3.80621 20.3746 4.19663C20.8036 4.58877 21.2021 5.01376 21.5703 5.47185C21.9486 5.94264 22.2512 6.3486 22.4806 6.6911C22.7091 7.03241 22.9058 7.37151 23.0712 7.70836C23.2466 8.0655 23.3704 8.31228 23.4393 8.44078C23.4466 8.45441 23.4533 8.46723 23.4594 8.47928L23.42 8.57175ZM9.53856 8.98622H12H13.1542L12.3647 8.14422L10.5845 6.24555C11.0023 5.89618 11.459 5.75365 11.9687 5.78563C12.6631 5.82919 13.2545 6.09335 13.762 6.59079C14.2469 7.066 14.5 7.6826 14.5 8.48622C14.5 9.28973 14.2467 9.91814 13.7569 10.4124C13.2531 10.9206 12.6715 11.1717 11.9895 11.1859C11.3247 11.1998 10.7544 10.9573 10.2527 10.4223C9.86397 10.0077 9.62632 9.53328 9.53856 8.98622ZM8.44014 4.76879C7.4897 5.80124 7.01332 7.0475 7.012 8.48028C6.97841 9.95273 7.45622 11.2176 8.44952 12.2392C9.43354 13.2512 10.6222 13.7794 11.9931 13.7984C13.3754 13.8175 14.5714 13.2835 15.5567 12.2326C16.5414 11.1824 17.0295 9.92278 17.012 8.48013C16.9945 7.04689 16.5101 5.80106 15.5599 4.76879C14.6022 3.72848 13.4053 3.19961 12 3.19961C10.5947 3.19961 9.39782 3.72848 8.44014 4.76879Z"
                  fill="#1D70B8" stroke="black"></path>
            </svg>
          </span>
          <span class="button-text">Preview page</span>
        </a>
        <button type="submit" class="govuk-button" data-module="govuk-button" data-govuk-button-init="">
          Save and continue
        </button>

        <a
          href="/library/form-to-go-live/editor-v2/page/b07e7a93-a5eb-49b4-9005-e7e5cc179ee8/delete/f8da282b-3d6f-4175-9168-8977de18862a"
          class="govuk-link govuk-link--no-visited-state">
          Delete question
        </a>
      </div>
    </form>
  </div>
</div>
`
}
export const questionDetailsLeftPanelHTML =
  questionDetailsLeftPanelBuilder(listItemsHTML)

export const questionDetailsPreviewHTML =
  '<div class="border-left-container-shorttext" id="question-preview-content"></div>'

/**
 *
 * @param {string} questionDetailsLeftPanelHTML
 * @param {string} questionDetailsPreviewHTML
 * @returns {string}
 */
export function buildQuestionStubPanels(
  questionDetailsLeftPanelHTML,
  questionDetailsPreviewHTML
) {
  return `
<div class="govuk-grid-row">
  <div class="govuk-grid-column-full">
    <div class="govuk-grid-column-one-half-from-desktop">${questionDetailsLeftPanelHTML}</div>
    <div class="govuk-grid-column-one-half-from-desktop">${questionDetailsPreviewHTML}</div>
  </div>
</div>
`
}

export const questionDetailsStubPanels = buildQuestionStubPanels(
  questionDetailsLeftPanelHTML,
  questionDetailsPreviewHTML
)

export const questionDetailsPreviewTabsHTML = `<div class="govuk-grid-column-one-half-from-desktop preview-panel" id="preview-panel" style="display: block;">
    <div id="preview-container-inner">
      <!-- Before content -->
      <div id="before-content" class="preview-before-content">
        <p class="govuk-body-s">Previews</p>
      </div>

      <div class="govuk-!-margin-top-9">
        <div class="govuk-tabs" data-module="govuk-tabs" data-govuk-tabs-init="">
          <h2 class="govuk-tabs__title">Contents</h2>
          <ul class="govuk-tabs__list" role="tablist">
            <li class="govuk-tabs__list-item govuk-tabs__list-item--selected" role="presentation">
              <a class="govuk-tabs__tab" href="#tab-preview" id="tab_tab-preview" role="tab" aria-controls="tab-preview" aria-selected="true" tabindex="0">Page preview</a>
            </li>
            <li class="govuk-tabs__list-item" role="presentation">
              <a class="govuk-tabs__tab" href="#tab-errors" id="tab_tab-errors" role="tab" aria-controls="tab-errors" aria-selected="false" tabindex="-1">Error messages</a>
            </li>
          </ul>

        <div class="govuk-tabs__panel" id="tab-preview" role="tabpanel" aria-labelledby="tab_tab-preview">
          <!-- Page Preview Content -->
          <div class="border-left-container-shorttext" id="question-preview-content">
            <div class="govuk-form-group">
              <fieldset class="govuk-fieldset" aria-describedby="radioInputField-hint">
                <legend class="govuk-fieldset__legend govuk-fieldset__legend--l">Question title</legend>
              </fieldset>
            </div>

          </div>
        </div>

        <div class="govuk-tabs__panel govuk-tabs__panel--hidden" id="tab-errors" role="tabpanel" aria-labelledby="tab_tab-errors">
        <!-- Error Messages Content -->
        <div class="govuk-error-summary" data-disable-auto-focus="true">
          <h2 class="govuk-error-summary__title">There is a problem</h2>
          <ul class="govuk-list govuk-error-summary__list">
            <!-- Error messages -->
            <li>
              <a id="empty-input-error-shorttext" class="govuk-error-message">
                <span class="govuk-visually-hidden">Error:</span>
                Enter <span id="error-dynamic-text" style="text-transform: lowercase;">[Short description]</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
`
