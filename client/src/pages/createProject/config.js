/*
 * @Author: Azhou
 * @Date: 2021-05-22 23:02:30
 * @LastEditors: Azhou
 * @LastEditTime: 2021-05-22 23:02:31
 */
export const posSample = {
  content: 'cd players and tuners',
  annotation: [
    { label: ['Category'], points: [{ start: 0, end: 1, text: 'cd' }] },
    { label: ['Category'], points: [{ start: 3, end: 9, text: 'players' }] },
    { label: ['Category'], points: [{ start: 15, end: 20, text: 'tuners' }] },
  ],
  extras: { Name: 'columnName', Class: 'ColumnValue' },
}
export const imagePolyBoundingSample = {
  content: 'https://s3.amazonaws.com/com.dataturks.uploads/airplanes__image_0001.jpg',
  annotation: [
    {
      label: 'Airplane',
      points: [
        [0.2500753738173288, 0.20270832379659018],
        [0.34806532356607256, 0.4579166571299235],
        [0.6143969818575299, 0.40583332379659015],
        [0.7400251225610475, 0.42145832379659015],
        [0.7927889416565248, 0.5620833237965902],
        [0.8681658260786353, 0.6245833237965902],
        [0.8983165798474796, 0.7131249904632568],
        [0.8204271326112986, 0.7443749904632568],
        [0.7274623084906957, 0.7704166571299235],
        [0.6093718562293892, 0.7235416571299235],
        [0.551582911505771, 0.7443749904632568],
        [0.4762060270836605, 0.8016666571299235],
        [0.43097989643039414, 0.7443749904632568],
        [0.34304019793793183, 0.7027083237965902],
        [0.23248743411883638, 0.7131249904632568],
        [0.1420351728123037, 0.6766666571299235],
        [0.09178391653089667, 0.6089583237965902],
        [0.11188441904345948, 0.44749999046325683],
        [0.16967336376707756, 0.4579166571299235],
        [0.14957286125451477, 0.3172916571299235],
        [0.1420351728123037, 0.2079166571299235],
        [0.25510049944546953, 0.19749999046325683],
        [0.2500753738173288, 0.20270832379659018],
      ],
      imageWidth: 398,
      imageHeight: 164,
    },
  ],
  extras: null,
}

export const textClassificationJsonSample =
  '{ "content": "when his eye chanced to fall upon alice, as she stood watching","annotation":{"labels":["fiction"],"note":"Alice Speaking"},"extras":null,"metadata":{"first_done_at":1539871791000,"last_updated_at":1539871791000,"sec_taken":0,"last_updated_by":"eMRjkQfSKOVqTlBUJqAKuAj6Tnv1","status":"done","evaluation":"NONE"}}'
