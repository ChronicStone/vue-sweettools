import type { defineFormSchemaSample } from '../utils'
import basic1 from './basic1'
import multiStep1 from './multiStep1'
import asyncOptionDeps from './asyncOptDeps'
import crossFieldValidation from './crossFieldValidation'
import customArrAction from './customActions'
import selectOptCreate from './selectOptionCreate'
import play from './play'

export const formSamples: Array<
  Omit<ReturnType<typeof defineFormSchemaSample>, 'formData'>
> = [
  basic1,
  asyncOptionDeps,
  multiStep1,
  crossFieldValidation,
  customArrAction,
  selectOptCreate,
  play,
]
