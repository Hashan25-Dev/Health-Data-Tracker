"""
Sample data generator — seeds the database with 90 days of realistic health data.
Run this script once after setting up the backend:
    python generate_sample_data.py
"""

import random
from datetime import date, timedelta
from app import create_app
from models import db, HealthRecord


def generate_sample_data(num_days=90):
    """
    Generate realistic health data with natural daily variation.
    Simulates a person gradually losing weight, with random fluctuations.
    """
    app = create_app()

    with app.app_context():
        # Clear existing records
        HealthRecord.query.delete()
        db.session.commit()

        start_date = date.today() - timedelta(days=num_days)
        base_weight = 82.0       # Starting weight in kg
        base_steps = 6000        # Starting daily steps
        base_calories = 2200     # Starting daily calories

        records = []

        for i in range(num_days):
            current_date = start_date + timedelta(days=i)

            # Gradual weight loss trend (~0.05 kg/day) + daily noise
            weight = base_weight - (i * 0.05) + random.uniform(-0.8, 0.8)
            weight = round(max(60, weight), 2)

            # Steps increase over time (getting healthier) + variation
            steps = base_steps + (i * 30) + random.randint(-2000, 2000)
            steps = max(1000, steps)

            # Calories decrease slightly (better diet) + variation
            calories = base_calories - (i * 3) + random.randint(-300, 300)
            calories = max(1200, min(3500, calories))

            record = HealthRecord(
                date=current_date,
                weight=weight,
                steps=steps,
                calories=calories,
            )
            records.append(record)

        db.session.add_all(records)
        db.session.commit()

        print(f'[OK] Successfully generated {num_days} sample health records!')
        print(f'   Date range: {records[0].date} to {records[-1].date}')
        print(f'   Weight range: {min(r.weight for r in records):.1f} - {max(r.weight for r in records):.1f} kg')
        print(f'   Steps range: {min(r.steps for r in records)} - {max(r.steps for r in records)}')


if __name__ == '__main__':
    generate_sample_data()
