import type { DeepPartial, DeepRequired, DeepReadonly, RequiredKeys, OptionalKeys } from './deep'
import { describe, expectTypeOf, it } from 'vitest'

describe('types > deep', () => {
  it('DeepPartial should make all nested properties optional', () => {
    interface Person {
      name: string
      address: { city: string; zip: string }
    }

    type Result = DeepPartial<Person>
    expectTypeOf<Result>().toEqualTypeOf<{
      name?: undefined | string
      address?: undefined | { city?: undefined | string; zip?: undefined | string }
    }>()
  })

  it('DeepPartial should handle arrays', () => {
    interface Person {
      hobbies: string[]
    }

    type Result = DeepPartial<Person>
    expectTypeOf<Result>().toEqualTypeOf<{
      hobbies?: undefined | string[]
    }>()
  })

  it('DeepRequired should make all nested properties required', () => {
    interface Person {
      name?: string
      address?: { city?: string; zip?: string }
    }

    type Result = DeepRequired<Person>
    expectTypeOf<Result>().toEqualTypeOf<{
      name: string
      address: { city: string; zip: string }
    }>()
  })

  it('DeepReadonly should make all nested properties readonly', () => {
    interface Person {
      name: string
      address: { city: string }
    }

    type Result = DeepReadonly<Person>
    expectTypeOf<Result>().toEqualTypeOf<{
      readonly name: string
      readonly address: { readonly city: string }
    }>()
  })

  it('RequiredKeys should extract required keys', () => {
    interface Person {
      name: string
      age?: number
      address: string
    }

    type Result = RequiredKeys<Person>
    expectTypeOf<Result>().toEqualTypeOf<'name' | 'address'>()
  })

  it('OptionalKeys should extract optional keys', () => {
    interface Person {
      name: string
      age?: number
      address: string
    }

    type Result = OptionalKeys<Person>
    expectTypeOf<Result>().toEqualTypeOf<'age'>()
  })
})
