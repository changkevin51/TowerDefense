from PIL import Image, ImageDraw
import os

def create_thumbnail(holder_path, gun_path, output_path):
    try:
        holder_img = Image.open(holder_path).convert("RGBA")
        gun_img = Image.open(gun_path).convert("RGBA")

        holder_w, holder_h = holder_img.size

        gun_target_w = holder_w * 2
        gun_target_h = holder_h * 2

        gun_resized_img = gun_img.resize((gun_target_w, gun_target_h), Image.LANCZOS)

        canvas_w = gun_target_w
        canvas_h = gun_target_h
        
        canvas = Image.new("RGBA", (canvas_w, canvas_h), (0,0,0,0)) 

        holder_x = (canvas_w - holder_w) // 2
        holder_y = (canvas_h - holder_h) // 2
        canvas.paste(holder_img, (holder_x, holder_y), holder_img)
        canvas.paste(gun_resized_img, (0, 0), gun_resized_img)
        canvas.save(output_path)
        print(f"Successfully created image: {output_path}")

    except FileNotFoundError as e:
        print(f"Error creating image: {e}. Check file paths.")
    except Exception as e:
        print(f"An unexpected error occurred while creating {output_path}: {e}")

turrets_data = {
    "machinegun": {
        "holder": "images/machinegun/redHolder.png",
        "gun": "images/machinegun/tile000.png",
        "output": "images/turrets/machinegun.png"
    }
}

output_dir = "images/turrets"
if not os.path.exists(output_dir):
    os.makedirs(output_dir)
    print(f"Created directory: {output_dir}")

for turret_name, paths in turrets_data.items():
    print(f"Processing {turret_name}...")
    create_thumbnail(paths["holder"], paths["gun"], paths["output"])

print("Image creation process finished.")
