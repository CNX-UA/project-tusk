class Rack::Attack
  Rack::Attack.cache.store = ActiveSupport::Cache::MemoryStore.new

  throttle('login/ip', limit: 5, period: 60.seconds) do |req|
    if req.path == '/login' && req.post?
      req.ip
    end
  end

  throttle('req/ip', limit: 100, period: 1.minute) do |req|
    req.ip
  end

  self.throttled_response = lambda do |env|
    match_data = env['rack.attack.match_data']
    now = match_data[:epoch_time]

    retry_after = (match_data[:period] - (now % match_data[:period])).to_i

    [ 429,
      { 'Content-Type' => 'application/json', 'Retry-After' => retry_after.to_s },
      [{ error: "Rate limit exceeded. Try again in #{retry_after} seconds." }.to_json]
    ]
  end
end