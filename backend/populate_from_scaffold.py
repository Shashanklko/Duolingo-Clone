import os
import json
from app.database import engine, SessionLocal, Base
from app import models

# High-resolution image assets
APPLE_IMG = "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=300&q=80"
MAN_IMG   = "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80"
WOMAN_IMG = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80"
BOY_IMG   = "https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=300&q=80"
GIRL_IMG  = "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80"
DOG_IMG   = "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=300&q=80"
CAT_IMG   = "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=300&q=80"
HOUSE_IMG = "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=300&q=80"
WATER_IMG = "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=300&q=80"
CAR_IMG   = "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=300&q=80"

VOCAB_MAP = {
    "en": {
        "apple": "Apple", "man": "Man", "woman": "Woman",
        "boy": "Boy", "girl": "Girl", "water": "Water",
        "dog": "Dog", "cat": "Cat", "house": "House", "car": "Car",
        "hello": "Hello", "goodbye": "Goodbye", "thanks": "Thank you",
        "boy_water": "The boy drinks water", "she_milk": "She drinks milk", "i_bread": "I eat bread"
    },
    "es": {
        "apple": "la manzana", "man": "el hombre", "woman": "la mujer",
        "boy": "el niño", "girl": "la niña", "water": "agua",
        "dog": "el perro", "cat": "el gato", "house": "la casa", "car": "el coche",
        "hello": "Hola", "goodbye": "Adiós", "thanks": "Gracias",
        "boy_water": "El niño bebe agua", "she_milk": "Ella bebe leche", "i_bread": "Yo como pan"
    },
    "hi": {
        "apple": "सेब", "man": "आदमी", "woman": "औरत",
        "boy": "लड़का", "girl": "लड़की", "water": "पानी",
        "dog": "कुत्ता", "cat": "बिल्ली", "house": "घर", "car": "गाड़ी",
        "hello": "नमस्ते", "goodbye": "अलविदा", "thanks": "धन्यवाद",
        "boy_water": "लड़का पानी पीता है", "she_milk": "वह दूध पीती है", "i_bread": "मैं रोटी खाता हूँ"
    },
    "fr": {
        "apple": "la pomme", "man": "l'homme", "woman": "la femme",
        "boy": "le garçon", "girl": "la fille", "water": "eau",
        "dog": "le chien", "cat": "le chat", "house": "la maison", "car": "la voiture",
        "hello": "Bonjour", "goodbye": "Au revoir", "thanks": "Merci",
        "boy_water": "Le garçon boit de l'eau", "she_milk": "Elle boit du lait", "i_bread": "Je mange du pain"
    },
    "de": {
        "apple": "der Apfel", "man": "der Mann", "woman": "die Frau",
        "boy": "der Junge", "girl": "das Mädchen", "water": "Wasser",
        "dog": "der Hund", "cat": "die Katze", "house": "das Haus", "car": "das Auto",
        "hello": "Hallo", "goodbye": "Auf Wiedersehen", "thanks": "Danke",
        "boy_water": "Der Junge trinkt Wasser", "she_milk": "Sie trinkt Milch", "i_bread": "Ich esse Brot"
    },
    "it": {
        "apple": "la mela", "man": "l'uomo", "woman": "la donna",
        "boy": "il ragazzo", "girl": "la ragazza", "water": "acqua",
        "dog": "il cane", "cat": "il gatto", "house": "la casa", "car": "l'auto",
        "hello": "Ciao", "goodbye": "Arrivederci", "thanks": "Grazie",
        "boy_water": "Il ragazzo beve acqua", "she_milk": "Lei beve latte", "i_bread": "Io mangio pane"
    },
    "pt": {
        "apple": "a maçã", "man": "o homem", "woman": "a mulher",
        "boy": "o menino", "girl": "a menina", "water": "água",
        "dog": "o cachorro", "cat": "o gato", "house": "a casa", "car": "o carro",
        "hello": "Olá", "goodbye": "Adeus", "thanks": "Obrigado",
        "boy_water": "O menino bebe água", "she_milk": "Ela bebe leite", "i_bread": "Eu como pão"
    },
    "ja": {
        "apple": "りんご", "man": "男の人", "woman": "女の人",
        "boy": "男の子", "girl": "女の子", "water": "水",
        "dog": "犬", "cat": "猫", "house": "家", "car": "車",
        "hello": "こんにちは", "goodbye": "さようなら", "thanks": "ありがとう",
        "boy_water": "男の子は水を飲みます", "she_milk": "彼女は牛乳を飲みます", "i_bread": "私はパンを食べます"
    },
    "ar": {
        "apple": "تفاحة", "man": "رجل", "woman": "امرأة",
        "boy": "ولد", "girl": "بنت", "water": "ماء",
        "dog": "كلب", "cat": "قطة", "house": "بيت", "car": "سيارة",
        "hello": "مرحبا", "goodbye": "مع السلامة", "thanks": "شكرا",
        "boy_water": "الولد يشرب الماء", "she_milk": "هي تشرب الحليب", "i_bread": "أنا آكل الخبز"
    },
    "ko": {
        "apple": "사과", "man": "남자", "woman": "여자",
        "boy": "소년", "girl": "소녀", "water": "물",
        "dog": "개", "cat": "고양이", "house": "집", "car": "자동차",
        "hello": "안녕하세요", "goodbye": "안녕히 계세요", "thanks": "감사합니다",
        "boy_water": "소년이 물을 마십니다", "she_milk": "그녀는 우유를 마십니다", "i_bread": "나는 빵을 먹습니다"
    },
    "ru": {
        "apple": "яблоко", "man": "мужчина", "woman": "женщина",
        "boy": "мальчик", "girl": "девочка", "water": "вода",
        "dog": "собака", "cat": "кошка", "house": "дом", "car": "машина",
        "hello": "Привет", "goodbye": "До свидания", "thanks": "Спасибо",
        "boy_water": "Мальчик пьет воду", "she_milk": "Она пьет молоко", "i_bread": "Я ем хлеб"
    },
}

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")

def build_questions_for_level(level_type: str, lang_code: str):
    v = VOCAB_MAP.get(lang_code, VOCAB_MAP["es"])
    is_english_course = (lang_code == "en")

    if level_type == "mcq":
        return [
            {
                "question": 'Which one of these is "Apple" (सेब)?' if is_english_course else 'Which one of these is "the apple"?',
                "type": "image_choice",
                "options": [
                    {"text": "Apple" if is_english_course else v["apple"], "image": APPLE_IMG},
                    {"text": "Man" if is_english_course else v["man"], "image": MAN_IMG},
                    {"text": "Woman" if is_english_course else v["woman"], "image": WOMAN_IMG},
                ],
                "correct_answer": "Apple" if is_english_course else v["apple"]
            },
            {
                "question": 'Which one of these is "Man" (आदमी)?' if is_english_course else 'Which one of these is "the man"?',
                "type": "image_choice",
                "options": [
                    {"text": "Man" if is_english_course else v["man"], "image": MAN_IMG},
                    {"text": "Woman" if is_english_course else v["woman"], "image": WOMAN_IMG},
                    {"text": "Boy" if is_english_course else v["boy"], "image": BOY_IMG},
                ],
                "correct_answer": "Man" if is_english_course else v["man"]
            },
            {
                "question": 'Which one of these is "Dog" (कुत्ता)?' if is_english_course else 'Which one of these is "the dog"?',
                "type": "image_choice",
                "options": [
                    {"text": "Dog" if is_english_course else v["dog"], "image": DOG_IMG},
                    {"text": "Cat" if is_english_course else v["cat"], "image": CAT_IMG},
                    {"text": "House" if is_english_course else v["house"], "image": HOUSE_IMG},
                ],
                "correct_answer": "Dog" if is_english_course else v["dog"]
            },
            {
                "question": 'Which one of these is "Water" (पानी)?' if is_english_course else 'Which one of these is "water"?',
                "type": "image_choice",
                "options": [
                    {"text": "Water" if is_english_course else v["water"], "image": WATER_IMG},
                    {"text": "Apple" if is_english_course else v["apple"], "image": APPLE_IMG},
                    {"text": "Car" if is_english_course else v["car"], "image": CAR_IMG},
                ],
                "correct_answer": "Water" if is_english_course else v["water"]
            },
            {
                "question": 'Which one of these is "Woman" (औरत)?' if is_english_course else 'Which one of these is "the woman"?',
                "type": "image_choice",
                "options": [
                    {"text": "Woman" if is_english_course else v["woman"], "image": WOMAN_IMG},
                    {"text": "Girl" if is_english_course else v["girl"], "image": GIRL_IMG},
                    {"text": "Man" if is_english_course else v["man"], "image": MAN_IMG},
                ],
                "correct_answer": "Woman" if is_english_course else v["woman"]
            },
        ]
    elif level_type in ["tile_build", "word_puzzle"]:
        if is_english_course:
            return [
                {
                    "question": 'Translate into English: "लड़का पानी पीता है"',
                    "type": "word_bank",
                    "options": ["The", "boy", "drinks", "water", "apple"],
                    "correct_answer": "The boy drinks water"
                },
                {
                    "question": 'Translate into English: "वह दूध पीती है"',
                    "type": "word_bank",
                    "options": ["She", "drinks", "milk", "water"],
                    "correct_answer": "She drinks milk"
                },
                {
                    "question": 'Translate into English: "मैं रोटी खाता हूँ"',
                    "type": "word_bank",
                    "options": ["I", "eat", "bread", "thanks"],
                    "correct_answer": "I eat bread"
                },
                {
                    "question": 'Translate into English: "नमस्ते, धन्यवाद"',
                    "type": "word_bank",
                    "options": ["Hello", "Thank", "you", "goodbye"],
                    "correct_answer": "Hello Thank you"
                },
                {
                    "question": 'Translate into English: "पानी और रोटी"',
                    "type": "word_bank",
                    "options": ["Water", "and", "bread", "apple"],
                    "correct_answer": "Water and bread"
                },
            ]
        else:
            return [
                {
                    "question": 'Translate: "The boy drinks water"',
                    "type": "word_bank",
                    "options": v["boy_water"].split() + [v["apple"]],
                    "correct_answer": v["boy_water"]
                },
                {
                    "question": 'Translate: "She drinks milk"',
                    "type": "word_bank",
                    "options": v["she_milk"].split() + [v["water"]],
                    "correct_answer": v["she_milk"]
                },
                {
                    "question": 'Translate: "I eat bread"',
                    "type": "word_bank",
                    "options": v["i_bread"].split() + [v["thanks"]],
                    "correct_answer": v["i_bread"]
                },
                {
                    "question": 'Translate: "Hello, thank you"',
                    "type": "word_bank",
                    "options": [v["hello"], v["thanks"], v["goodbye"]],
                    "correct_answer": f'{v["hello"]} {v["thanks"]}'
                },
                {
                    "question": 'Translate: "Water and bread"',
                    "type": "word_bank",
                    "options": [v["water"], v["i_bread"].split()[-1], v["apple"]],
                    "correct_answer": f'{v["water"]} {v["i_bread"].split()[-1]}'
                },
            ]
    elif level_type in ["listen_select", "listening"]:
        if is_english_course:
            return [
                {
                    "question": '🔊 Listen and select English translation for "नमस्ते":',
                    "type": "select_translation",
                    "options": [{"text": "Hello", "correct": True}, {"text": "Goodbye", "correct": False}, {"text": "Thanks", "correct": False}],
                    "correct_answer": "Hello"
                },
                {
                    "question": '🔊 Listen and select English translation for "धन्यवाद":',
                    "type": "select_translation",
                    "options": [{"text": "Thank you", "correct": True}, {"text": "Please", "correct": False}, {"text": "Yes", "correct": False}],
                    "correct_answer": "Thank you"
                },
                {
                    "question": '🔊 Listen and select English translation for "पानी":',
                    "type": "select_translation",
                    "options": [{"text": "Water", "correct": True}, {"text": "Milk", "correct": False}, {"text": "Bread", "correct": False}],
                    "correct_answer": "Water"
                },
                {
                    "question": '🔊 Listen and select English translation for "अलविदा":',
                    "type": "select_translation",
                    "options": [{"text": "Goodbye", "correct": True}, {"text": "Hello", "correct": False}, {"text": "Sorry", "correct": False}],
                    "correct_answer": "Goodbye"
                },
                {
                    "question": '🔊 Listen and select English translation for "आदमी":',
                    "type": "select_translation",
                    "options": [{"text": "Man", "correct": True}, {"text": "Woman", "correct": False}, {"text": "Boy", "correct": False}],
                    "correct_answer": "Man"
                },
            ]
        else:
            return [
                {
                    "question": f'🔊 Listen and select: "{v["hello"]}"',
                    "type": "select_translation",
                    "options": [{"text": "Hello", "correct": True}, {"text": "Goodbye", "correct": False}, {"text": "Thanks", "correct": False}],
                    "correct_answer": "Hello"
                },
                {
                    "question": f'🔊 Listen and select: "{v["thanks"]}"',
                    "type": "select_translation",
                    "options": [{"text": "Thank you", "correct": True}, {"text": "Please", "correct": False}, {"text": "Yes", "correct": False}],
                    "correct_answer": "Thank you"
                },
                {
                    "question": f'🔊 Listen and select: "{v["water"]}"',
                    "type": "select_translation",
                    "options": [{"text": "Water", "correct": True}, {"text": "Milk", "correct": False}, {"text": "Bread", "correct": False}],
                    "correct_answer": "Water"
                },
                {
                    "question": f'🔊 Listen and select: "{v["goodbye"]}"',
                    "type": "select_translation",
                    "options": [{"text": "Goodbye", "correct": True}, {"text": "Hello", "correct": False}, {"text": "Sorry", "correct": False}],
                    "correct_answer": "Goodbye"
                },
                {
                    "question": f'🔊 Listen and select: "{v["man"]}"',
                    "type": "select_translation",
                    "options": [{"text": "Man", "correct": True}, {"text": "Woman", "correct": False}, {"text": "Boy", "correct": False}],
                    "correct_answer": "Man"
                },
            ]
    else: # translate / puzzle
        if is_english_course:
            return [
                {
                    "question": '🏆 English Mastery Exam: Select translation for "आदमी"',
                    "type": "select_translation",
                    "options": [{"text": "Man", "correct": True}, {"text": "Woman", "correct": False}, {"text": "Girl", "correct": False}],
                    "correct_answer": "Man"
                },
                {
                    "question": '🏆 English Mastery Exam: Translate "लड़का पानी पीता है"',
                    "type": "word_bank",
                    "options": ["The", "boy", "drinks", "water", "apple"],
                    "correct_answer": "The boy drinks water"
                },
                {
                    "question": '🏆 English Mastery Exam: Which one of these is "Apple"?',
                    "type": "image_choice",
                    "options": [
                        {"text": "Apple", "image": APPLE_IMG},
                        {"text": "Man", "image": MAN_IMG},
                        {"text": "Woman", "image": WOMAN_IMG},
                    ],
                    "correct_answer": "Apple"
                },
                {
                    "question": '🏆 English Mastery Exam: Select translation for "नमस्ते"',
                    "type": "select_translation",
                    "options": [{"text": "Hello", "correct": True}, {"text": "Goodbye", "correct": False}, {"text": "Thanks", "correct": False}],
                    "correct_answer": "Hello"
                },
                {
                    "question": '🏆 English Mastery Exam: Translate "वह दूध पीती है"',
                    "type": "word_bank",
                    "options": ["She", "drinks", "milk", "water"],
                    "correct_answer": "She drinks milk"
                },
            ]
        else:
            return [
                {
                    "question": '🏆 Mastery Exam: Select correct translation for "Man"',
                    "type": "select_translation",
                    "options": [{"text": v["man"], "correct": True}, {"text": v["woman"], "correct": False}, {"text": v["girl"], "correct": False}],
                    "correct_answer": v["man"]
                },
                {
                    "question": '🏆 Mastery Exam: Translate "The boy drinks water"',
                    "type": "word_bank",
                    "options": v["boy_water"].split() + [v["apple"]],
                    "correct_answer": v["boy_water"]
                },
                {
                    "question": '🏆 Mastery Exam: Which one of these is "the apple"?',
                    "type": "image_choice",
                    "options": [
                        {"text": v["apple"], "image": APPLE_IMG},
                        {"text": v["man"], "image": MAN_IMG},
                        {"text": v["woman"], "image": WOMAN_IMG},
                    ],
                    "correct_answer": v["apple"]
                },
                {
                    "question": '🏆 Mastery Exam: Select translation for "Hello"',
                    "type": "select_translation",
                    "options": [{"text": v["hello"], "correct": True}, {"text": v["goodbye"], "correct": False}, {"text": v["thanks"], "correct": False}],
                    "correct_answer": v["hello"]
                },
                {
                    "question": '🏆 Mastery Exam: Translate "She drinks milk"',
                    "type": "word_bank",
                    "options": v["she_milk"].split() + [v["water"]],
                    "correct_answer": v["she_milk"]
                },
            ]

def seed_scaffold():
    print("Scaffolding courses from backend/data JSON schema...")
    
    index_file = os.path.join(DATA_DIR, "_index.json")
    if not os.path.exists(index_file):
        print(f"[ERROR] {index_file} not found!")
        return

    with open(index_file, "r", encoding="utf-8") as f:
        index_data = json.load(f)

    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        # Seed default user
        default_user = models.User(
            name="Guest Learner",
            email=None,
            is_guest=True,
            streak=3,
            xp=120,
            hearts=5,
            gems=500,
        )
        db.add(default_user)
        db.commit()

        for lang in index_data.get("languages", []):
            lang_code = lang["language"]
            course_file_name = lang["file"]
            course_file_path = os.path.join(DATA_DIR, course_file_name)

            flag_code = "us" if lang_code == "en" else ("in" if lang_code == "hi" else ("sa" if lang_code == "ar" else ("kr" if lang_code == "ko" else ("jp" if lang_code == "ja" else lang_code))))

            course = models.Course(
                language_code=lang_code,
                name=lang["languageName"],
                flag_code=flag_code,
                learners=f"10.5M learners",
            )
            db.add(course)
            db.commit()
            db.refresh(course)

            print(f"  [Scaffold] Seeding Course: {course.name} ({lang_code})...")

            course_json = {}
            if os.path.exists(course_file_path):
                with open(course_file_path, "r", encoding="utf-8") as f:
                    course_json = json.load(f)

            units = course_json.get("units", [])
            if not units:
                # Default 4 units template if empty
                units = [
                    {
                        "unitId": f"{lang_code}_unit_1",
                        "unitTitle": "Greetings & Introductions" if lang_code == "en" else "Basics & Greetings",
                        "levels": [
                            {"levelId": 1, "type": "mcq"},
                            {"levelId": 2, "type": "tile_build"},
                            {"levelId": 3, "type": "puzzle"},
                            {"levelId": 4, "type": "listen_select"},
                            {"levelId": 5, "type": "translate"},
                        ]
                    },
                    {
                        "unitId": f"{lang_code}_unit_2",
                        "unitTitle": "Food, Drinks & Routine",
                        "levels": [
                            {"levelId": 1, "type": "mcq"},
                            {"levelId": 2, "type": "tile_build"},
                            {"levelId": 3, "type": "puzzle"},
                            {"levelId": 4, "type": "listen_select"},
                            {"levelId": 5, "type": "translate"},
                        ]
                    },
                ]

            for u_idx, u in enumerate(units):
                unit_title = u.get("unitTitle", f"Unit {u_idx + 1}")
                unit = models.Unit(
                    course_id=course.id,
                    title=f"Unit {u_idx + 1}",
                    description=unit_title,
                    color="#58cc02" if u_idx == 0 else ("#ce82ff" if u_idx == 1 else "#00cd9c"),
                    order_index=u_idx + 1,
                )
                db.add(unit)
                db.commit()
                db.refresh(unit)

                levels = u.get("levels", [])
                for l_idx, lvl in enumerate(levels):
                    level_type = lvl.get("type", "mcq")
                    skill_title = f"Level {l_idx + 1} - {level_type.upper()}"
                    
                    skill = models.Skill(
                        unit_id=unit.id,
                        title=skill_title,
                        icon="star" if l_idx < 4 else "trophy",
                        position=0 if l_idx % 2 == 0 else (1 if l_idx % 3 == 0 else -1),
                    )
                    db.add(skill)
                    db.commit()
                    db.refresh(skill)

                    lesson = models.Lesson(
                        skill_id=skill.id,
                        title=f"Lesson {l_idx + 1}",
                        xp_reward=20,
                    )
                    db.add(lesson)
                    db.commit()
                    db.refresh(lesson)

                    # Build exercises based on scaffold schema level types!
                    questions = build_questions_for_level(level_type, lang_code)
                    for q in questions:
                        exercise = models.Exercise(
                            lesson_id=lesson.id,
                            type=q["type"],
                            question=q["question"],
                            options_json=json.dumps(q["options"]),
                            correct_answer=q["correct_answer"],
                        )
                        db.add(exercise)

            db.commit()

        print("\n[OK] Scaffold data fully ingested into FastAPI SQLite database!")

    except Exception as e:
        print(f"[ERROR] Error processing scaffold: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_scaffold()
