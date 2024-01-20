from flask import Flask, jsonify

from flask_cors import CORS
import csv
import os


app = Flask(__name__)
CORS(app)


@app.route('/veriler', methods=['GET'])
def get_veriler():
    try:
        path = os.path.join(app.root_path, "../csvs/yoklama_listesi.csv")
        with open(path, mode='r') as dosya:
            okuyucu = csv.DictReader(dosya)
            veriler = list(okuyucu)
            return jsonify(veriler)
    except FileNotFoundError:
        return jsonify({"hata": "CSV dosyası bulunamadı"}), 404
    except Exception as e:
        return jsonify({"hata": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
