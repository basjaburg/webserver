#added
import os
from flask import Flask, request, jsonify, render_template, render_template_string, send_from_directory, abort



app = Flask(__name__)
port = 9999


@app.route('/')
def index():
  return send_from_directory('', 'index.html')


@app.route('/dir')
def list_files():
  # Start in the base directory of your choice
  base_dir = os.getcwd()
  # Retrieve the subdirectory from the URL query if present
  sub_path = request.args.get('dir', '')
  # Construct the full directory path
  directory_path = os.path.join(base_dir, sub_path)

  # Ensure that the path is within the base_dir to prevent directory traversal attacks
  if not os.path.realpath(directory_path).startswith(
      os.path.realpath(base_dir)):
    return "Access denied", 403

  # Get list of files and directories
  items = os.listdir(directory_path)

  # Generate links with query parameters for directories
  file_links = []

  # Link to go up one directory
  if sub_path:  # Only show the link if not in the root directory
    parent_path = '/'.join(sub_path.split('/')[:-1])
    up_link = f'<a href="/?dir={parent_path}">..</a>'
    file_links.append(up_link)

  for item in items:
    item_path = os.path.join(sub_path, item)
    if os.path.isdir(os.path.join(directory_path, item)):
      link = f'<a href="/?dir={item_path}">{item}/</a>'
    else:
      link = f'<a href="{item_path}">{item}</a>'
    file_links.append(link)

  # Simple HTML template to display the file links
  template = '''
    <!DOCTYPE html>
    <html>
    <head>
        <title>Directory Listing</title>
    </head>
    <body>
        <h1>Files in Directory</h1>
        <ul>
            {% for file in files %}
            <li>{{ file|safe }}</li>
            {% endfor %}
        </ul>
    </body>
    </html>
    '''

  # Render the template with the file links
  return render_template_string(template, files=file_links)


@app.route('/<path:path>')
def serve_static(path):
  return send_from_directory('', path)

#app.run(host='0.0.0.0', port=port)
