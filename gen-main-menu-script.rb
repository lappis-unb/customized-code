require 'json'

def get_components_links(spaces, space_label)
  spaces_links = spaces.map do |space|
    links = space.components.map do |component|
      label = component.respond_to?('name') ? 'name' : 'title'
      label_pt_br = component.send(label)['pt-br'] || component.send(label)['pt'] || 'Componente'
      url = "/#{space_label}/#{space.slug}/f/#{component.id}"
      { 'id' => (label_pt_br + '_' + component.id.to_s), 'label' => label_pt_br, 'href' => url, "is_visible"=> true }
    end
    label_pt_br = space.send('title')['pt-br'] || space.send('title')['pt'] || 'Espaço'
    { 'id' => (space_label + '_' + space.id.to_s), 'label' => label_pt_br, 'sub_items' => links, "is_visible"=> true }
  end
  spaces_links
end

processes = get_components_links(Decidim::ParticipatoryProcess.all, 'processes')
assemblies = get_components_links(Decidim::Assembly.all, 'assemblies')

result = processes + assemblies

filename = 'main-menu-generated.rb'

new_result = { 'menu' => result }
File.open(filename, 'w') do |file|
  file.write(new_result.to_json.to_s.gsub(':', '=>'))
end