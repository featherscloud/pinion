import type { Question, QuestionCollection } from 'inquirer'

type InferAnswerType<Q extends Question> = Q extends { type: 'input' }
  ? string
  : Q extends { type: 'list' }
  ? string
  : Q extends { type: 'rawlist' }
  ? string
  : Q extends { type: 'number' }
  ? number
  : Q extends { type: 'password' }
  ? string
  : Q extends { type: 'confirm' }
  ? boolean
  : Q extends { type: 'checkbox' }
  ? string[]
  : Q extends { type: 'editor' }
  ? string
  : unknown

export type InferAnswerTypes<Q extends QuestionCollection> = Q extends ReadonlyArray<
  Question & { name: string }
>
  ? { [K in Q[number] as K['name']]: InferAnswerType<K> }
  : {
      [K in keyof Q]: InferAnswerType<Q[K]>
    }
