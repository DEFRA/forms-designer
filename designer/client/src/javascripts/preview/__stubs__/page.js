import {
  MAX_NUMBER_OF_REPEAT_ITEMS,
  MIN_NUMBER_OF_REPEAT_ITEMS
} from '@defra/forms-model'

export const pageHeadingAndGuidanceHTML = `
<div>
  <div class="govuk-checkboxes__item">
        <input class="govuk-checkboxes__input" id="pageHeadingAndGuidance" name="pageHeadingAndGuidance" type="checkbox" value="true" checked="">
        <label class="govuk-label govuk-checkboxes__label" for="pageHeadingAndGuidance">
          Add a page heading, guidance or both
        </label>
      </div>
  <div class="govuk-checkboxes__conditional" id="conditional-pageHeadingAndGuidance">
      <div class="govuk-form-group">
  <label class="govuk-label govuk-label--m" for="pageHeading">
    Page heading
  </label>
  <div id="pageHeading-hint" class="govuk-hint">
    Page headings should be a statement and not a question. For example, 'Passport information'
  </div>
  <input class="govuk-input" id="pageHeading" name="pageHeading" type="text" value="Where do you live?" aria-describedby="pageHeading-hint">
</div>

  <div class="govuk-form-group">
  <label class="govuk-label govuk-label--m" for="guidanceText">
    Guidance text (optional)
  </label>
  <div id="guidanceText-hint" class="govuk-hint">
    Use Markdown to format the content or add hyperlinks
  </div>
  <textarea class="govuk-textarea" id="guidanceText" name="guidanceText" rows="3" aria-describedby="guidanceText-hint">Guidance text</textarea>
</div>
<details class="govuk-details">
  <summary class="govuk-details__summary">
    <span class="govuk-details__summary-text">
                                Help with markdown
                              </span>
  </summary>
  <div class="govuk-details__text">
    <h3 class="govuk-heading-s">Headings and subheadings</h3>
    <p class="govuk-body">Use one hash symbol followed by a space for a heading, for example:
                              </p>
    <pre class="formatting-example" style="background-color: white;"><code class="lang-md"># This is a heading</code></pre>
    <p class="bottom-gutter-1-3">To add a subheading, use 2 hash symbols:</p>
    <pre class="formatting-example" style="background-color: white;"><code class="lang-md">## This is a subheading</code></pre>

    <h3 class="govuk-heading-s" id="bullets">Bullet points</h3>
    <p class="govuk-body">Use bullet points to help words or phrases stand out in your emails
                                and letters.</p>
    <p class="govuk-body">Copy this example to add bullet points:</p>
    <pre class="formatting-example" style="background-color: white;"><code class="lang-md">Introduce bullet points with a lead-in line ending in a colon:

* leave one empty line space after the lead-in line
* use an asterisk or a dash followed by a space to add an item
* start each item with a lowercase letter, do not end with a full stop
* leave one empty line space after the last item</code></pre>

    <h3 class="govuk-heading-s" id="bullets">Numbered steps</h3>
    <p class="govuk-body">Copy this example to add numbered steps:</p>
    <pre class="formatting-example" style="background-color: white;"><code class="lang-md">1. Leave one empty line space before starting your list.
2. Enter a number followed by a full stop and a space to add an item.
3. Start each item with a capital letter and end it with a full stop.
4. Leave one empty line space after the last item.</code></pre>

    <h3 class="govuk-heading-s">Links and URLs</h3>
    <p class="govuk-body">To convert text into a link, use square brackets around the link
                                text and round brackets around the full URL. Make sure there are no spaces between the
                                brackets or the link will not work. For example:</p>
    <pre class="formatting-example" style="background-color: white;"><code class="lang-md">[Apply now](https://www.gov.uk/example)</code></pre>

  </div>
</details>
    </div>
  <div class="govuk-form-group">
      <div class="govuk-checkboxes" data-module="govuk-checkboxes" data-govuk-checkboxes-init="">
        <div class="govuk-checkboxes__item">
          <input class="govuk-checkboxes__input" id="repeater" name="repeater" type="checkbox" value="true" aria-controls="conditional-repeater" aria-expanded="false">
          <label class="govuk-label govuk-checkboxes__label" for="repeater">
            Allow multiple responses to questions on this page
          </label>
        </div>
        <div class="govuk-checkboxes__conditional govuk-checkboxes__conditional--hidden" id="conditional-repeater">
          <fieldset class="govuk-fieldset govuk-!-margin-bottom-6">
      <legend class="govuk-fieldset__legend">
        Set the minimum and maximum number of responses you will accept
      </legend>
        <div class="govuk-hint">
      The range must be between ${MIN_NUMBER_OF_REPEAT_ITEMS} and ${MAX_NUMBER_OF_REPEAT_ITEMS}
    </div>

        <div class="govuk-form-group">
      <label class="govuk-label govuk-label--m" for="minItems">
        Min
      </label>
      <input class="govuk-input govuk-input--width-2" id="minItems" name="minItems" type="text" value="1" inputmode="numeric">
    </div>

        <div class="govuk-form-group">
      <label class="govuk-label govuk-label--m" for="maxItems">
        Max
      </label>
      <input class="govuk-input govuk-input--width-2" id="maxItems" name="maxItems" type="text" value="3" inputmode="numeric">
    </div>


    </fieldset>
      <div class="govuk-form-group">
      <label class="govuk-label govuk-label--m" for="questionSetName">
        Give the responses an identifiable name or label
      </label>
      <div id="questionSetName-hint" class="govuk-hint">
        Use a word to describe what these questions are asking about. For example, ‘Cow’, ‘Pet’. This will be used to categorise the answers, for example ‘Cow 1’, ‘Cow 2’.
      </div>
      <input class="govuk-input" id="questionSetName" name="questionSetName" type="text" value="" aria-describedby="questionSetName-hint">
    </div>
        </div>
      </div>
  </div>
</div>
`

export const repeaterPageHTML = /** @type {string} */ (
  `
<div class="govuk-!-padding-top-3">
                  <h1 class="govuk-heading-l" id="page-heading">Page 16</h1>


                      <dl class="govuk-summary-list govuk-summary-list__show_final_divider">
  <div class="govuk-summary-list__row">
    <dt class="govuk-summary-list__key govuk-!-width-one-quarter">
      Question 1
    </dt>
    <dd class="govuk-summary-list__value govuk-!-width-one-half">
      Simple text field
    </dd>
    <dd class="govuk-summary-list__actions">
      <a class="govuk-link govuk-link--no-visited-state govuk-!-width-one-quarter" href="/library/chemistry/editor-v2/page/32888028-61db-40fc-b255-80bc67829d31/question/ee83413e-31b6-4158-98e0-4611479582ce/details">Change<span class="govuk-visually-hidden"> name</span></a>
    </dd>
  </div>
</dl>
                  <div class="govuk-button-group govuk-!-margin-top-6">

<a href="http://localhost:3009/form/preview/draft/chemistry/repeater-page?force" role="button" target="_blank" id="preview-page" draggable="false" class="govuk-button  govuk-button--inverse" data-module="govuk-button" data-govuk-button-init="">
  <span class="icon-wrapper">
        <svg width="24" height="17" viewBox="0 0 24 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M23.42 8.57175L23.4145 8.58481L23.4097 8.59816C23.3429 8.78328 23.238 9.00239 23.0886 9.2573C22.9298 9.52824 22.7228 9.87643 22.4673 10.3023C22.2277 10.7014 21.9331 11.1051 21.5814 11.5128C21.2252 11.9258 20.8204 12.3494 20.3664 12.7835C19.9256 13.205 19.4124 13.6141 18.8247 14.01C18.244 14.4012 17.6245 14.7357 16.9657 15.0134C16.3098 15.29 15.5465 15.5293 14.6726 15.729C13.8178 15.9244 12.9302 16.0145 12.0089 15.9981C11.0758 15.9815 10.1762 15.8904 9.30954 15.7253C8.44417 15.5605 7.70002 15.3321 7.07186 15.045C6.42176 14.7479 5.78632 14.4008 5.1655 14.0035C4.54798 13.6084 4.04112 13.2115 3.63933 12.8147C3.21885 12.3994 2.81352 11.9589 2.42339 11.4929C2.03009 11.023 1.7314 10.6298 1.52201 10.3108C1.30821 9.98506 1.10923 9.64233 0.92516 9.28242C0.730757 8.9023 0.621902 8.67581 0.583944 8.58135C0.571792 8.55111 0.559969 8.52204 0.548485 8.49418L0.556069 8.478C0.680152 8.28917 0.809181 8.00974 0.943944 7.67437C1.06885 7.36354 1.25291 7.0437 1.50227 6.71517C1.77608 6.35442 2.08956 5.93435 2.44256 5.45519C2.77046 5.01009 3.15984 4.59421 3.61254 4.20795C4.08069 3.80851 4.60573 3.39882 5.18832 2.97899C5.74736 2.57613 6.36096 2.23646 7.0305 1.96057C7.70215 1.6838 8.46464 1.45309 9.32031 1.27056C10.1633 1.09076 11.0561 1 12 1C12.9439 1 13.8367 1.09076 14.6797 1.27056C15.5349 1.45299 16.2879 1.68332 16.9417 1.959C17.5985 2.23593 18.2251 2.57814 18.8218 2.9861C19.4309 3.40252 19.9476 3.80621 20.3746 4.19663C20.8036 4.58877 21.2021 5.01376 21.5703 5.47185C21.9486 5.94264 22.2512 6.3486 22.4806 6.6911C22.7091 7.03241 22.9058 7.37151 23.0712 7.70836C23.2466 8.0655 23.3704 8.31228 23.4393 8.44078C23.4466 8.45441 23.4533 8.46723 23.4594 8.47928L23.42 8.57175ZM9.53856 8.98622H12H13.1542L12.3647 8.14422L10.5845 6.24555C11.0023 5.89618 11.459 5.75365 11.9687 5.78563C12.6631 5.82919 13.2545 6.09335 13.762 6.59079C14.2469 7.066 14.5 7.6826 14.5 8.48622C14.5 9.28973 14.2467 9.91814 13.7569 10.4124C13.2531 10.9206 12.6715 11.1717 11.9895 11.1859C11.3247 11.1998 10.7544 10.9573 10.2527 10.4223C9.86397 10.0077 9.62632 9.53328 9.53856 8.98622ZM8.44014 4.76879C7.4897 5.80124 7.01332 7.0475 7.012 8.48028C6.97841 9.95273 7.45622 11.2176 8.44952 12.2392C9.43354 13.2512 10.6222 13.7794 11.9931 13.7984C13.3754 13.8175 14.5714 13.2835 15.5567 12.2326C16.5414 11.1824 17.0295 9.92278 17.012 8.48013C16.9945 7.04689 16.5101 5.80106 15.5599 4.76879C14.6022 3.72848 13.4053 3.19961 12 3.19961C10.5947 3.19961 9.39782 3.72848 8.44014 4.76879Z" fill="#1D70B8" stroke="black"></path>
    </svg>

  </span>
  <span class="button-text">Preview page</span>
</a>


                      <a href="/library/chemistry/editor-v2/page/32888028-61db-40fc-b255-80bc67829d31/question/new/type" role="button" draggable="false" class="govuk-button" data-module="govuk-button" data-govuk-button-init="">
  Add another question
</a>



                    <a href="/library/chemistry/editor-v2/page/32888028-61db-40fc-b255-80bc67829d31/delete" class="govuk-link govuk-link--no-visited-state">
                      Delete page
                    </a>
                  </div>

                  <a href="#" class="govuk-skip-link" data-module="govuk-skip-link">Skip to page preview</a>


                  <hr class="govuk-section-break govuk-section-break--m govuk-section-break--visible">
<h1 class="govuk-heading-l">Settings</h1>
<h2 class="govuk-heading-m">Page heading and guidance text</h2>

<div class="govuk-form-group">
  <div class="govuk-checkboxes" data-module="govuk-checkboxes" data-govuk-checkboxes-init="">
    <div class="govuk-checkboxes__item">
      <input class="govuk-checkboxes__input" id="pageHeadingAndGuidance" name="pageHeadingAndGuidance" type="checkbox" value="true" checked="" aria-controls="conditional-pageHeadingAndGuidance" aria-expanded="true">
      <label class="govuk-label govuk-checkboxes__label" for="pageHeadingAndGuidance">
        Add a page heading, guidance or both
      </label>
    </div>
    <div class="govuk-checkboxes__conditional" id="conditional-pageHeadingAndGuidance">
      <div class="govuk-form-group">
  <label class="govuk-label govuk-label--m" for="pageHeading">
    Page heading
  </label>
  <div id="pageHeading-hint" class="govuk-hint">
    Page headings should be a statement and not a question. For example, 'Passport information'
  </div>
  <input class="govuk-input" id="pageHeading" name="pageHeading" type="text" value="Repeater Page" aria-describedby="pageHeading-hint">
</div>

  <div class="govuk-form-group">
  <label class="govuk-label govuk-label--m" for="guidanceText">
    Guidance text (optional)
  </label>
  <div id="guidanceText-hint" class="govuk-hint">
    Use Markdown to format the content or add hyperlinks
  </div>
  <textarea class="govuk-textarea" id="guidanceText" name="guidanceText" rows="3" aria-describedby="guidanceText-hint"></textarea>
</div>
<details class="govuk-details">
  <summary class="govuk-details__summary">
    <span class="govuk-details__summary-text">
                                Help with markdown
                              </span>
  </summary>
  <div class="govuk-details__text">
    <h3 class="govuk-heading-s">Headings and subheadings</h3>
    <p class="govuk-body">Use one hash symbol followed by a space for a heading, for example:
                              </p>
    <pre class="formatting-example" style="background-color: white;"><code class="lang-md"># This is a heading</code></pre>
    <p class="bottom-gutter-1-3">To add a subheading, use 2 hash symbols:</p>
    <pre class="formatting-example" style="background-color: white;"><code class="lang-md">## This is a subheading</code></pre>

    <h3 class="govuk-heading-s" id="bullets">Bullet points</h3>
    <p class="govuk-body">Use bullet points to help words or phrases stand out in your emails
                                and letters.</p>
    <p class="govuk-body">Copy this example to add bullet points:</p>
    <pre class="formatting-example" style="background-color: white;"><code class="lang-md">Introduce bullet points with a lead-in line ending in a colon:

* leave one empty line space after the lead-in line
* use an asterisk or a dash followed by a space to add an item
* start each item with a lowercase letter, do not end with a full stop
* leave one empty line space after the last item</code></pre>

    <h3 class="govuk-heading-s" id="bullets">Numbered steps</h3>
    <p class="govuk-body">Copy this example to add numbered steps:</p>
    <pre class="formatting-example" style="background-color: white;"><code class="lang-md">1. Leave one empty line space before starting your list.
2. Enter a number followed by a full stop and a space to add an item.
3. Start each item with a capital letter and end it with a full stop.
4. Leave one empty line space after the last item.</code></pre>

    <h3 class="govuk-heading-s">Links and URLs</h3>
    <p class="govuk-body">To convert text into a link, use square brackets around the link
                                text and round brackets around the full URL. Make sure there are no spaces between the
                                brackets or the link will not work. For example:</p>
    <pre class="formatting-example" style="background-color: white;"><code class="lang-md">[Apply now](https://www.gov.uk/example)</code></pre>

  </div>
</details>
    </div>
  </div>
</div>


  <div class="govuk-form-group">
  <div class="govuk-checkboxes" data-module="govuk-checkboxes" data-govuk-checkboxes-init="">
    <div class="govuk-checkboxes__item">
      <input class="govuk-checkboxes__input" id="repeater" name="repeater" type="checkbox" value="true" checked="" aria-controls="conditional-repeater" aria-expanded="true">
      <label class="govuk-label govuk-checkboxes__label" for="repeater">
        Allow multiple responses to questions on this page
      </label>
    </div>
    <div class="govuk-checkboxes__conditional" id="conditional-repeater">
      <fieldset class="govuk-fieldset govuk-!-margin-bottom-6">
  <legend class="govuk-fieldset__legend">
    Set the minimum and maximum number of responses you will accept
  </legend>
    <div class="govuk-hint">
  The range must be between ${MIN_NUMBER_OF_REPEAT_ITEMS} and ${MAX_NUMBER_OF_REPEAT_ITEMS}
</div>

    <div class="govuk-form-group">
  <label class="govuk-label govuk-label--m" for="minItems">
    Min
  </label>
  <input class="govuk-input govuk-input--width-2" id="minItems" name="minItems" type="text" value="1" inputmode="numeric">
</div>

    <div class="govuk-form-group">
  <label class="govuk-label govuk-label--m" for="maxItems">
    Max
  </label>
  <input class="govuk-input govuk-input--width-2" id="maxItems" name="maxItems" type="text" value="3" inputmode="numeric">
</div>


</fieldset>
  <div class="govuk-form-group">
  <label class="govuk-label govuk-label--m" for="questionSetName">
    Give the responses an identifiable name or label
  </label>
  <div id="questionSetName-hint" class="govuk-hint">
    Use a word to describe what these questions are asking about. For example, ‘Cow’, ‘Pet’. This will be used to categorise the answers, for example ‘Cow 1’, ‘Cow 2’.
  </div>
  <input class="govuk-input" id="questionSetName" name="questionSetName" type="text" value="Simple question responses" aria-describedby="questionSetName-hint">
</div>
    </div>
  </div>
</div>


<button type="submit" class="govuk-button" data-module="govuk-button" data-govuk-button-init="">
  Save changes
</button>
<hr class="govuk-section-break govuk-section-break--xl govuk-section-break--visible">
  <h1 class="govuk-heading-l">Page conditions</h1>
  <p class="govuk-body">Control whether this page is shown to users based on their answer to a previous question</p>

  <div class="govuk-inset-text">
  <h2 class="govuk-heading-m govuk-!-margin-top-0">Current conditions</h2>
          <p class="govuk-body govuk-!-margin-bottom-0">No conditions have been added to this page yet.</p>
</div>


  <a href="/library/chemistry/editor-v2/page/32888028-61db-40fc-b255-80bc67829d31/conditions" class="govuk-button" role="button" draggable="false" data-module="govuk-button" data-govuk-button-init="">
    Manage conditions
  </a>
</div>
`
)

export const summaryPageHTML = (
  declaration = false,
  declarationContent = '',
  disableConfirmationEmail = false,
  showConfirmationEmailFallback = 'false'
) => `
<form id="checkAnswersForm" class="form" method="post">
  <input type="hidden" id="showConfirmationEmailFallback" value="${showConfirmationEmailFallback}">
  <fieldset class="govuk-fieldset">
    <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
      Do users need to make a declaration?
    </legend>

            <div class="govuk-form-group">
    <div id="needDeclaration-hint" class="govuk-hint">
      Use a declaration if you need users to declare or agree to something before they submit the form
    </div>
    <div class="govuk-radios" data-module="govuk-radios" data-govuk-radios-init="">
      <div class="govuk-radios__item">
        <input class="govuk-radios__input" id="needDeclaration" name="needDeclaration" type="radio" value="false" ${!declaration ? 'checked=""' : ''}>
        <label class="govuk-label govuk-radios__label" for="needDeclaration">
          No
        </label>
      </div>
      <div class="govuk-radios__item">
        <input class="govuk-radios__input" id="needDeclaration-2" name="needDeclaration" type="radio" value="true" aria-controls="conditional-needDeclaration-2" aria-expanded="false" ${declaration ? 'checked=""' : ''}>
        <label class="govuk-label govuk-radios__label" for="needDeclaration-2">
          Yes
        </label>
      </div>
      <div class="govuk-radios__conditional govuk-radios__conditional--hidden" id="conditional-needDeclaration-2">
        <div class="govuk-form-group">
    <label class="govuk-label govuk-label--m" for="declarationText">
      Declaration text
    </label>
    <div id="declarationText-hint" class="govuk-hint">
      Use a declaration if you need users to declare or agree to something before they submit the form
    </div>
    <textarea class="govuk-textarea" id="declarationText" name="declarationText" rows="3" aria-describedby="declarationText-hint">${declarationContent}</textarea>
  </div>
      </div>
    </div>
  </div>
  </fieldset>
  <fieldset class="govuk-fieldset">
    <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
      Disable confirmation email
    </legend>
    <div class="govuk-form-group">
      <div class="govuk-radios" data-module="govuk-radios" data-govuk-radios-init="">
        <div class="govuk-radios__item">
          <input class="govuk-radios__input" id="disableConfirmationEmail" name="disableConfirmationEmail" type="radio" value="false" ${!disableConfirmationEmail ? 'checked=""' : ''}>
          <label class="govuk-label govuk-radios__label" for="disableConfirmationEmail">
            No
          </label>
        </div>
        <div class="govuk-radios__item">
          <input class="govuk-radios__input" id="disableConfirmationEmail-2" name="disableConfirmationEmail" type="radio" value="true" ${disableConfirmationEmail ? 'checked=""' : ''}>
          <label class="govuk-label govuk-radios__label" for="disableConfirmationEmail-2">
            Yes
          </label>
        </div>
      </div>
    </div>
  </fieldset>
</form>
`
