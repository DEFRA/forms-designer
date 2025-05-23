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
