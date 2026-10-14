export const shortDescInputHTML =
  '<input id="shortDescription" name="shortDescription" value="" />'

export const panelHTML = `
<div class="govuk-error-summary" data-disable-auto-focus="true">
<h2 class="govuk-error-summary__title">There is a problem</h2>
<ul class="govuk-list govuk-error-summary__list">
  <!-- Error messages -->
  <li>
    <a id="empty-input-error-shorttext" class="govuk-error-message">
      <span class="govuk-visually-hidden">Error:</span>
      Enter <span class="error-preview-shortDescription" data-templatefunc="lowerFirst"></span>
    </a>
  </li>
    <h3 class="govuk-heading-s">If you set answer limits:</h3>
    <li>
      <a id="too-long-input-error-shorttext" class="govuk-error-message">
        <span class="govuk-visually-hidden">Error:</span>
        <span class="error-preview-shortDescription"></span> must be <span class="error-preview-min"></span> characters or more
      </a>
    </li>
    <li>
      <a id="too-long-input-error-shorttext" class="govuk-error-message">
        <span class="govuk-visually-hidden">Error:</span>
        <span class="error-preview-shortDescription"></span> must be <span class="error-preview-max"></span> characters or less
      </a>
    </li>
    <li>
      <a id="too-long-input-error-shorttext" class="govuk-error-message">
        <span class="govuk-visually-hidden">Error:</span>
        <span class="error-preview-shortDescription"></span> must be between [min length] and [max length] characters
      </a>
    </li>
</ul>
          <a href="#edit-page" class="govuk-skip-link" style="margin-bottom: 30px!important;" data-module="govuk-skip-link" data-govuk-skip-link-init="">
            Skip to edit page
          </a>
</div>
`

export const panelCheckYourAnswersHTML = `
<div class="govuk-tabs__panel" id="tab-cya" role="tabpanel" aria-labelledby="tab_tab-cya" tabindex="0">
  <!-- Check Your Answers Content -->
  <p class="govuk-body-s govuk-!-margin-bottom-4">
    Preview of how the short description appears on the check your answers page
  </p>

  <h2 class="govuk-heading-l">Check your answers before sending your form</h2>
  <dl class="govuk-summary-list govuk-!-margin-bottom-9">
    <div class="govuk-summary-list__row">
      <dt class="govuk-summary-list__key">
        <span id="cya-short-description-preview1" class="error-preview-shortDescription" data-overrideplaceholder="[Short description]">[Short description]</span>
      </dt>
      <dd class="govuk-summary-list__value">Answer goes here</dd>
      <dd class="govuk-summary-list__actions">
        <a class="govuk-link govuk-link--disabled" href="#" aria-disabled="true">
            Change<span class="govuk-visually-hidden error-preview-shortDescription" id="cya-short-description-preview2" data-overrideplaceholder="[Short description]">[Short description]</span>
          </a>
      </dd>
    </div>
  </dl>
  <button type="button" class="govuk-button" data-module="govuk-button" disabled="" data-govuk-button-init="">Accept and send</button>
</div>
`
