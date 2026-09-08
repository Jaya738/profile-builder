export type ValidationError = { path: string; message: string }

function isString(v: unknown): v is string {
  return typeof v === 'string'
}

function isArray(v: unknown): v is unknown[] {
  return Array.isArray(v)
}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function requireString(obj: Record<string, unknown>, key: string, path: string, errors: ValidationError[], optional = false) {
  const v = obj[key]
  if (v === undefined || v === '') {
    if (!optional) errors.push({ path: `${path}.${key}`, message: `"${key}" is required` })
    return
  }
  if (!isString(v)) errors.push({ path: `${path}.${key}`, message: `"${key}" must be a string` })
}

function requireArray(obj: Record<string, unknown>, key: string, path: string, errors: ValidationError[]) {
  const v = obj[key]
  if (v === undefined) {
    errors.push({ path: `${path}.${key}`, message: `"${key}" must be an array` })
    return
  }
  if (!isArray(v)) errors.push({ path: `${path}.${key}`, message: `"${key}" must be an array` })
}

export function validateProfile(raw: unknown): ValidationError[] {
  const errors: ValidationError[] = []

  if (!isObject(raw)) {
    return [{ path: '', message: 'Profile must be a JSON object' }]
  }

  requireString(raw, 'id', '', errors)

  if (!isObject(raw.meta)) {
    errors.push({ path: 'meta', message: '"meta" is required and must be an object' })
  } else {
    requireString(raw.meta, 'profileName', 'meta', errors)
    requireString(raw.meta, 'template', 'meta', errors)
    if (!isObject(raw.meta.theme)) {
      errors.push({ path: 'meta.theme', message: '"theme" is required and must be an object' })
    }
  }

  if (!isObject(raw.personal)) {
    errors.push({ path: 'personal', message: '"personal" is required and must be an object' })
  } else {
    requireString(raw.personal, 'fullName', 'personal', errors)
    requireString(raw.personal, 'title', 'personal', errors, true)
    if (raw.personal.links !== undefined && !isArray(raw.personal.links)) {
      errors.push({ path: 'personal.links', message: '"links" must be an array' })
    }
  }

  requireString(raw, 'summary', '', errors, true)
  requireArray(raw, 'experience', '', errors)
  requireArray(raw, 'education', '', errors)
  requireArray(raw, 'skills', '', errors)
  requireArray(raw, 'projects', '', errors)
  requireArray(raw, 'certifications', '', errors)

  if (isArray(raw.experience)) {
    raw.experience.forEach((item, i) => {
      if (!isObject(item)) {
        errors.push({ path: `experience[${i}]`, message: 'must be an object' })
        return
      }
      requireString(item, 'company', `experience[${i}]`, errors)
      requireString(item, 'role', `experience[${i}]`, errors)
      if (item.bullets !== undefined && !isArray(item.bullets)) {
        errors.push({ path: `experience[${i}].bullets`, message: '"bullets" must be an array' })
      }
    })
  }

  if (isArray(raw.education)) {
    raw.education.forEach((item, i) => {
      if (!isObject(item)) {
        errors.push({ path: `education[${i}]`, message: 'must be an object' })
        return
      }
      requireString(item, 'school', `education[${i}]`, errors)
      requireString(item, 'degree', `education[${i}]`, errors)
    })
  }

  if (isArray(raw.skills)) {
    raw.skills.forEach((item, i) => {
      if (!isObject(item)) {
        errors.push({ path: `skills[${i}]`, message: 'must be an object' })
        return
      }
      requireString(item, 'label', `skills[${i}]`, errors)
      if (item.items !== undefined && !isArray(item.items)) {
        errors.push({ path: `skills[${i}].items`, message: '"items" must be an array' })
      }
    })
  }

  return errors
}
