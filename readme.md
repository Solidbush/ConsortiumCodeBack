### Задание: Java Script, Node JS

1. Есть таблицы (PgSql, но диалект в данном случае не важен, пишите как на том который
знаете):
```sql
CREATE TABLE public.departments (
    id integer NOT NULL DEFAULT nextval('departments_id_seq'::regclass),
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    file_id character varying(32) COLLATE pg_catalog."default",
    CONSTRAINT departments_pkey PRIMARY KEY (id)
)

CREATE TABLE public.dep_names (
    id integer NOT NULL DEFAULT nextval('dep_names_id_seq'::regclass),
    name character varying(1024) COLLATE pg_catalog."default" NOT NULL,
    department_id integer,
    name_tsvector tsvector,
    CONSTRAINT dep_names_pkey PRIMARY KEY (id)
)

dep_names .department_id (многие) ссылается на departments.id (к одному)
```

#### Вопросы
1. Запрос (SELECT) для построения списка departments.id, для которых нет связанных
   названий (строк в dep_names).
```sql
SELECT departments.id
FROM public.departments
LEFT JOIN public.dep_names ON departments.id = dep_names.department_id
WHERE dep_names.id IS NULL;
```

2. Запрос (SELECT) для построения списка departments.id, для которых есть 2 и более
   названий.
```sql
SELECT departments.id
FROM public.departments
JOIN public.dep_names ON departments.id = dep_names.department_id
GROUP BY departments.id
HAVING COUNT(dep_names.id) >= 2;
```

3. Запрос (SELECT) для построения списка departments.*, для каждого указать только 1
   название (даже если их несколько) с минимальным dep_names.id.
```sql
SELECT department_id, name
FROM (
    SELECT 
        department_id, 
        name,
        ROW_NUMBER() OVER (PARTITION BY department_id ORDER BY id) AS row_num
    FROM public.dep_names
) AS ranked_names
WHERE row_num = 1;
```
***Вообще у нас был курс по БД, где мы писали всякие запросики к тренировочной базе данных Microsoft, но в курсовой работе нас просили использовать ORM (Я использовал Sequelize)***

2. Есть объекты вида:
```ts
{
    id: ...integer...,
   time_stamp: ...,
   parent: ...ССЫЛКА НА ВЕРХНИЙ ОБЪЕКТ В ИЕРАРХИИ...,
   contact: {server: ..., email: ..., users: [name, ...]},
   addresses: [adress1, ...],
}
```
Какую структуру таблиц в реляционной БД нужно создать для хранения этой
информации?

***Ответ:***
```sql
CREATE TABLE objects (
    id SERIAL PRIMARY KEY,
    time_stamp TIMESTAMP,
    parent_id INTEGER REFERENCES objects(id),
);

CREATE TABLE contacts (
    id SERIAL PRIMARY KEY,
    object_id INTEGER REFERENCES objects(id),
    server VARCHAR(255),
    email VARCHAR(255),
);

CREATE TABLE contact_users (
    id SERIAL PRIMARY KEY,
    contact_id INTEGER REFERENCES contacts(id),
    user_name VARCHAR(255),
);

CREATE TABLE addresses (
    id SERIAL PRIMARY KEY,
    object_id INTEGER REFERENCES objects(id),
    address VARCHAR(255),
);
```

### Задачи

3. Проверить, является ли целое число квадратом, не используя математические функции.
```js
function isSquare(number) {
    if (number < 0) {
        console.log("Отрицательное число!");
        return false;
    }

    for (let i = 0; i * i <= number; i++) {
        if (i * i === number) {
            console.log("Да, является!");
            return true;
        }
    }
    console.log("Нет, не является!");
    return false;
}
```

4. Напишите на js функцию, которая принимает два аргумента: массив из уникальных
   целых чисел и сумму в виде целого числа.

```js
function QuickSort(array) {
    if (array.length <= 1) {
        return array;
    }

    const pivot = array[array.length - 1];
    const leftList = [];
    const rightList = [];

    for (let i = 0; i < array.length - 1; i++) {
        if (array[i] < pivot) {
            leftList.push(array[i]);
        }
        else {
            rightList.push(array[i])
        }
    }

    return [...QuickSort(leftList), pivot, ...QuickSort(rightList)];
}


function finPair(array, targetSum) {
    if (!Array.isArray(array)) {
        throw new Error(`First argument is not array!`) // проверка на array
    }

    let sortedArray = QuickSort(array);

    let left = 0;
    let right = sortedArray.length - 1;

    while (left !== right) {
        let tempSum = sortedArray[left] + sortedArray[right]
        if (tempSum < targetSum) {
            left += 1;
        }
        else if (tempSum > targetSum) {
            right -= 1;
        }
        else {
            return [sortedArray[left], sortedArray[right]]
        }
    }

    return [];
}

array = [3, 5, -4, 8, 11, 1, -1, 6]
targetSum = 10

console.log(finPair(array, targetSum))
```

5. Попробуйте проанализировать код и понять что делает следующая функция на
   javascript, т.е. что получит функция call_back в первом параметре. 
> **Ответ:**
> 
>Функция **func** принимает массив arr и колюэк функцию **call_back**. После чего проверяет что передан массив, 
> что переданный массив состоит из целых неотрицательных чисел. 
> Далее создается функция **f** которая добавляет переданное значение в массив **res** и если длинна массива **res** 
> равна длине исходного массива вызывает функцию **call_back** c параметром **res**.
> Далее в цикле **for** проходимся по всем элементам исходного массива и вызываем функцию **f** с текущим элементом и задержкой равной этому элементу.


5. (для крутых) 
```js
async function func(arr, call_back) {
    if(!Array.isArray(arr) || arr.some(it => parseInt(it) != it || it < 0))
        call_back(null, "Неверный формат входящих данных, должен быть массив положительных чисел");
    let res = [];

    async function delay(t, val) {
        return new Promise(resolve => setTimeout(resolve, t, val));
    }
    function f(val) {
        res.push(val);
        if(res.length == arr.length)
            call_back(res);
    }
    for(let i = 0; i < arr.length; i++) {
        await delay(arr[i], arr[i]);
        f(arr[i]);
    }
}
```
6. Модуль для подсчета тегов в **\*.html** и **\*.htm** файлах.

>Файл скрипта **fileSearch.module.js**
> 
>Вызов скрипта:
```cmd
node index.js D:\Users\Volirvag\Desktop\test "He1llo world"
```

### Мои проекты:
1. RestApi Service [ссылка](https://github.com/Solidbush/web-backend-part) 
***Может загружаться немного долго, так как я использовал бесплатный тариф от Render***