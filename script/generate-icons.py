#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Скрипт для генерации иконок Chrome Extension из исходного изображения.
Создает иконки размеров 16x16, 48x48 и 128x128 пикселей.
"""

from PIL import Image
import os
import sys

# Устанавливаем UTF-8 кодировку для вывода
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def generate_icons(source_path, output_dir):
    """Генерирует иконки разных размеров из исходного изображения."""
    
    # Размеры иконок для Chrome Extension
    sizes = [16, 48, 128]
    
    # Открываем исходное изображение
    try:
        img = Image.open(source_path)
        print(f"[OK] Открыто изображение: {source_path}")
        print(f"  Размер оригинала: {img.size[0]}x{img.size[1]} пикселей")
    except Exception as e:
        print(f"[ERROR] Ошибка при открытии изображения: {e}")
        return False
    
    # Конвертируем в RGBA если нужно (для поддержки прозрачности)
    if img.mode != 'RGBA':
        img = img.convert('RGBA')
    
    # Создаем директорию для вывода если её нет
    os.makedirs(output_dir, exist_ok=True)
    
    # Генерируем иконки для каждого размера
    success = True
    for size in sizes:
        try:
            # Используем LANCZOS для лучшего качества при уменьшении
            resized = img.resize((size, size), Image.Resampling.LANCZOS)
            output_path = os.path.join(output_dir, f"icon{size}.png")
            resized.save(output_path, format='PNG', optimize=True)
            print(f"[OK] Создана иконка: {output_path} ({size}x{size})")
        except Exception as e:
            print(f"[ERROR] Ошибка при создании иконки {size}x{size}: {e}")
            success = False
    
    return success

if __name__ == "__main__":
    # Путь к исходному изображению
    source_image = r"C:\Users\W1ns\.cursor\projects\e-DEV-Project-PS-Store-Atlas\assets\c__Users_W1ns_AppData_Roaming_Cursor_User_workspaceStorage_ee1637d83d401829e7fc34e13a4bd58c_images_Gemini_Generated_Image_rl33dvrl33dvrl33-7d348aef-bdfd-409d-b3ce-b4a3fc3385d7.png"
    
    # Директория для сохранения иконок
    output_directory = r"E:\DEV\Project\PS-Store-Atlas\chrome-extension\assets"
    
    print("Генерация иконок для Chrome Extension...")
    print(f"Источник: {source_image}")
    print(f"Вывод: {output_directory}")
    print("-" * 60)
    
    if generate_icons(source_image, output_directory):
        print("-" * 60)
        print("[SUCCESS] Все иконки успешно созданы!")
    else:
        print("-" * 60)
        print("[ERROR] Произошли ошибки при создании иконок")
        sys.exit(1)
