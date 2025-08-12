# AI Integration Architecture
*BMAD Method: Architecture Shard for AI Integration Components*

## Overview
This document describes the comprehensive AI integration architecture for SEC-TESTER, including LiteLLM multi-provider support, Ollama local models, RAG/CAG/KAG advanced capabilities, and security-specific AI features.

## AI Service Layer Architecture

### AI Service Components Structure
```
backend/
├── ai/
│   ├── __init__.py
│   ├── providers/          # AI provider implementations
│   │   ├── litellm_provider.py    # LiteLLM integration
│   │   ├── ollama_provider.py     # Local Ollama models
│   │   └── provider_manager.py    # Provider selection and fallback
│   ├── chat/              # Chat interface logic
│   │   ├── conversation.py        # Conversation management
│   │   ├── context.py            # Security context tracking
│   │   └── history.py            # Chat history persistence
│   ├── analysis/          # AI-powered analysis
│   │   ├── vulnerability_analyzer.py  # CVE and threat analysis
│   │   ├── result_interpreter.py      # Test output interpretation
│   │   └── risk_assessor.py           # Intelligent risk scoring
│   ├── commands/          # Command execution system
│   │   ├── command_validator.py      # Safety validation
│   │   ├── approval_workflow.py      # Human approval process
│   │   └── sandbox_executor.py       # Safe command execution
│   ├── rag/               # Retrieval-Augmented Generation
│   │   ├── vector_store.py           # Vector database management
│   │   ├── document_processor.py     # Document chunking and embedding
│   │   ├── retriever.py             # Semantic search and retrieval
│   │   └── embeddings.py            # Text embedding generation
│   ├── cag/               # Context-Augmented Generation
│   │   ├── context_manager.py       # Dynamic context building
│   │   ├── relationship_mapper.py    # Entity relationship tracking
│   │   ├── vulnerability_graph.py    # Security knowledge graph
│   │   └── inference_engine.py      # Context-aware reasoning
│   ├── kag/               # Knowledge-Augmented Generation
│   │   ├── knowledge_base.py        # Structured security knowledge
│   │   ├── ontology_manager.py      # Security ontology management
│   │   ├── fact_extractor.py        # Knowledge extraction from results
│   │   └── reasoning_engine.py      # Logical inference and deduction
│   └── models/            # AI data models
│       ├── conversation.py
│       ├── message.py
│       ├── command_log.py
│       ├── knowledge_entity.py
│       └── vulnerability_node.py
```

## AI Provider Architecture

### LiteLLM Multi-Provider Configuration
```python
# Multi-provider AI configuration
AI_PROVIDERS = {
    "openai": {
        "api_key": "OPENAI_API_KEY",
        "models": ["gpt-4", "gpt-3.5-turbo"],
        "priority": 1
    },
    "anthropic": {
        "api_key": "ANTHROPIC_API_KEY", 
        "models": ["claude-3-opus", "claude-3-sonnet"],
        "priority": 2
    },
    "ollama": {
        "base_url": "http://localhost:11434",
        "models": ["llama2", "codellama", "mistral"],
        "priority": 3,
        "local": True
    }
}
```

### Provider Interface Design
```python
from abc import ABC, abstractmethod

class AIProvider(ABC):
    @abstractmethod
    async def generate_response(self, messages: List[Message], model: str) -> str:
        pass
    
    @abstractmethod
    async def analyze_security_output(self, test_results: dict) -> dict:
        pass
    
    @abstractmethod
    def get_available_models(self) -> List[str]:
        pass
    
    @abstractmethod
    def estimate_cost(self, input_tokens: int, output_tokens: int) -> float:
        pass
```

### LiteLLM Provider Implementation
```python
class LiteLLMProvider(AIProvider):
    def __init__(self):
        self.client = LiteLLM()
    
    async def generate_response(self, messages: List[Message], model: str) -> str:
        response = await self.client.acompletion(
            model=model,
            messages=[{"role": m.role, "content": m.content} for m in messages],
            stream=True
        )
        return response
    
    async def analyze_security_output(self, test_results: dict) -> dict:
        # AI-powered analysis of security test results
        analysis_prompt = self._build_analysis_prompt(test_results)
        return await self.generate_response(analysis_prompt, "gpt-4")
```

### Ollama Local Provider Implementation
```python
class OllamaProvider(AIProvider):
    def __init__(self, base_url: str = "http://localhost:11434"):
        self.base_url = base_url
        self.client = httpx.AsyncClient()
    
    async def generate_response(self, messages: List[Message], model: str) -> str:
        response = await self.client.post(
            f"{self.base_url}/api/generate",
            json={
                "model": model,
                "prompt": self._format_messages(messages),
                "stream": True
            }
        )
        return response
    
    async def pull_model(self, model_name: str) -> bool:
        # Download and manage local models
        response = await self.client.post(
            f"{self.base_url}/api/pull",
            json={"name": model_name}
        )
        return response.status_code == 200
```

## AI Data Models

### Conversation Management Models
```python
class Conversation:
    id: UUID
    user_id: UUID
    title: str
    created_at: datetime
    updated_at: datetime
    context: JSON  # Security context, current test results, etc.
    model_config: JSON  # AI model preferences
    encrypted: bool = True

class Message:
    id: UUID
    conversation_id: UUID
    role: str  # user, assistant, system
    content: TEXT
    message_type: str  # text, code, command, file_upload
    metadata: JSON  # tokens used, model, execution results
    timestamp: datetime

class CommandExecution:
    id: UUID
    message_id: UUID
    command: str
    status: str  # pending, approved, executed, denied
    approved_by: UUID
    executed_at: datetime
    output: TEXT
    exit_code: int
    risk_level: str

class KnowledgeEntity:
    id: UUID
    entity_type: str  # vulnerability, technique, tool, mitigation
    name: str
    description: TEXT
    properties: JSON
    embeddings: List[float]
    created_at: datetime
    updated_at: datetime

class VulnerabilityNode:
    id: UUID
    cve_id: str
    severity: str
    description: TEXT
    affected_systems: JSON
    relationships: JSON  # Connected entities and their relationships
    knowledge_graph_id: str
    embedding_vector: List[float]
```

## RAG (Retrieval-Augmented Generation) Implementation

### Vector Store Management
```python
class VectorStore:
    def __init__(self, collection_name: str = "security_knowledge"):
        self.client = chromadb.Client()
        self.collection = self.client.get_or_create_collection(
            name=collection_name,
            embedding_function=SentenceTransformerEmbeddings()
        )
    
    async def add_documents(self, documents: List[dict]) -> bool:
        """Add security documents to vector store"""
        texts = [doc["content"] for doc in documents]
        metadatas = [doc["metadata"] for doc in documents]
        ids = [doc["id"] for doc in documents]
        
        self.collection.add(
            documents=texts,
            metadatas=metadatas,
            ids=ids
        )
        return True
    
    async def similarity_search(self, query: str, k: int = 5) -> List[dict]:
        """Retrieve relevant documents for query"""
        results = self.collection.query(
            query_texts=[query],
            n_results=k,
            include=["documents", "metadatas", "distances"]
        )
        
        return [
            {
                "content": doc,
                "metadata": meta,
                "similarity": 1 - dist
            }
            for doc, meta, dist in zip(
                results["documents"][0],
                results["metadatas"][0], 
                results["distances"][0]
            )
        ]
```

### Document Processing Pipeline
```python
class DocumentProcessor:
    def __init__(self):
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )
    
    async def process_security_document(self, document: str, doc_type: str) -> List[dict]:
        """Process and chunk security documents for RAG"""
        chunks = self.text_splitter.split_text(document)
        
        processed_chunks = []
        for i, chunk in enumerate(chunks):
            processed_chunks.append({
                "id": f"{doc_type}_{i}",
                "content": chunk,
                "metadata": {
                    "type": doc_type,
                    "chunk_index": i,
                    "source": "security_database"
                }
            })
        
        return processed_chunks
```

## CAG (Context-Augmented Generation) Implementation

### Relationship Mapping Architecture
```python
class RelationshipMapper:
    def __init__(self, neo4j_driver):
        self.driver = neo4j_driver
    
    async def map_vulnerability_relationships(self, cve_id: str) -> dict:
        """Map relationships between vulnerabilities, systems, and mitigations"""
        query = """
        MATCH (v:Vulnerability {cve_id: $cve_id})
        OPTIONAL MATCH (v)-[:AFFECTS]->(s:System)
        OPTIONAL MATCH (v)-[:MITIGATED_BY]->(m:Mitigation)
        OPTIONAL MATCH (v)-[:EXPLOITED_BY]->(t:Technique)
        RETURN v, collect(s) as systems, collect(m) as mitigations, collect(t) as techniques
        """
        
        async with self.driver.session() as session:
            result = await session.run(query, cve_id=cve_id)
            record = await result.single()
            
            return {
                "vulnerability": record["v"],
                "affected_systems": record["systems"],
                "mitigations": record["mitigations"],
                "attack_techniques": record["techniques"]
            }
```

### Dynamic Context Management
```python
class ContextManager:
    def __init__(self, relationship_mapper: RelationshipMapper):
        self.relationship_mapper = relationship_mapper
        self.context_cache = {}
    
    async def build_dynamic_context(self, test_results: dict, conversation_history: List[dict]) -> dict:
        """Build dynamic context from test results and conversation"""
        context = {
            "current_test_context": await self._extract_test_context(test_results),
            "conversation_context": self._extract_conversation_context(conversation_history),
            "relationship_context": await self._build_relationship_context(test_results),
            "temporal_context": self._build_temporal_context(test_results)
        }
        
        return context
```

## KAG (Knowledge-Augmented Generation) Implementation

### Security Knowledge Base
```python
class SecurityKnowledgeBase:
    def __init__(self):
        self.facts = {}
        self.rules = []
        self.ontology = SecurityOntology()
    
    async def add_security_fact(self, fact_type: str, entity: str, properties: dict) -> bool:
        """Add structured security fact to knowledge base"""
        fact_id = f"{fact_type}_{entity}_{hash(str(properties))}"
        
        self.facts[fact_id] = {
            "type": fact_type,
            "entity": entity,
            "properties": properties,
            "confidence": properties.get("confidence", 1.0),
            "source": properties.get("source", "unknown"),
            "timestamp": datetime.utcnow()
        }
        
        return True
    
    async def infer_security_implications(self, test_results: dict) -> dict:
        """Infer security implications using knowledge base"""
        implications = {
            "direct_threats": [],
            "indirect_risks": [],
            "recommended_actions": [],
            "attack_scenarios": []
        }
        
        # Apply inference rules
        for rule in self.rules:
            if rule.applies_to(test_results):
                rule_result = rule.execute(test_results, self.facts)
                implications[rule.category].extend(rule_result)
        
        return implications
```

### Reasoning Engine Implementation
```python
class ReasoningEngine:
    def __init__(self, knowledge_base: SecurityKnowledgeBase):
        self.knowledge_base = knowledge_base
        self.inference_rules = self._load_inference_rules()
    
    async def reason_about_security_state(self, test_results: dict) -> dict:
        """Apply logical reasoning to security test results"""
        reasoning_result = {
            "logical_conclusions": [],
            "risk_inferences": [],
            "causal_chains": [],
            "predictive_insights": []
        }
        
        # Apply forward chaining inference
        conclusions = await self._forward_chain_inference(test_results)
        reasoning_result["logical_conclusions"] = conclusions
        
        # Identify causal chains
        causal_chains = await self._identify_causal_chains(test_results)
        reasoning_result["causal_chains"] = causal_chains
        
        # Generate predictive insights
        predictions = await self._generate_predictions(test_results, conclusions)
        reasoning_result["predictive_insights"] = predictions
        
        return reasoning_result
```

## Frontend AI Components Architecture

### AI Chat Interface Components
```
src/
├── components/
│   ├── ai/                 # AI-specific components
│   │   ├── ChatInterface.tsx      # Main chat component
│   │   ├── MessageBubble.tsx      # Individual message display
│   │   ├── CommandApproval.tsx    # Command execution approval
│   │   ├── ModelSelector.tsx      # AI model selection
│   │   ├── ConversationList.tsx   # Chat history sidebar
│   │   └── FileUpload.tsx         # File upload for analysis
│   ├── common/            # Generic components
│   ├── dashboard/         # Dashboard-specific widgets
│   ├── test/             # Test execution components
│   └── security/         # Security-specific UI elements
```

### AI WebSocket Integration
```typescript
interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  type: 'text' | 'code' | 'command' | 'file';
  timestamp: Date;
  metadata?: {
    model: string;
    tokens: number;
    execution_result?: CommandResult;
  };
}

class AIWebSocketService {
  private ws: WebSocket;
  
  sendMessage(message: AIMessage): void {
    this.ws.send(JSON.stringify({
      type: 'ai_message',
      payload: message
    }));
  }
  
  onAIResponse(callback: (message: AIMessage) => void): void {
    this.ws.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'ai_response') {
        callback(data.payload);
      }
    });
  }
}
```

## Security-Specific AI Features

### Vulnerability Analysis Engine
```python
class VulnerabilityAnalyzer:
    def __init__(self, ai_provider: AIProvider):
        self.ai_provider = ai_provider
        self.cve_database = CVEDatabase()
    
    async def analyze_findings(self, test_results: dict) -> dict:
        # Correlate findings with CVE database
        cve_matches = await self.cve_database.search_vulnerabilities(test_results)
        
        # AI-powered risk assessment
        analysis_prompt = f"""
        Analyze these security test results and provide:
        1. Risk assessment (Critical/High/Medium/Low)
        2. Exploitation difficulty
        3. Business impact
        4. Remediation steps
        
        Test Results: {test_results}
        CVE Matches: {cve_matches}
        """
        
        return await self.ai_provider.generate_response(analysis_prompt, "gpt-4")
```

### Command Safety System
```python
class CommandValidator:
    DANGEROUS_PATTERNS = [
        r'rm\s+-rf\s+/',
        r'dd\s+if=.*of=/dev/',
        r'mkfs\.',
        r'format\s+c:',
        # Add more dangerous patterns
    ]
    
    def validate_command(self, command: str) -> dict:
        risk_level = "LOW"
        warnings = []
        
        for pattern in self.DANGEROUS_PATTERNS:
            if re.search(pattern, command, re.IGNORECASE):
                risk_level = "CRITICAL"
                warnings.append(f"Potentially destructive pattern: {pattern}")
        
        return {
            "safe": risk_level in ["LOW", "MEDIUM"],
            "risk_level": risk_level,
            "warnings": warnings,
            "requires_approval": risk_level in ["HIGH", "CRITICAL"]
        }
```

## Infrastructure Requirements

### AI Service Dependencies
- **Vector Database:** Chroma (port 8000) for semantic search
- **Graph Database:** Neo4j (ports 7474/7687) for relationship mapping
- **Document Store:** Elasticsearch (port 9200) for full-text search
- **AI Runtime:** Ollama (port 11434) for local models
- **Environment:** Enhanced Miniconda with AI libraries


```yaml
services:
  chroma:
    image: chromadb/chroma:latest
    ports:
      - "8000:8000"
    volumes:
      - chroma_data:/chroma/chroma
    environment:
      - CHROMA_DB_IMPL=clickhouse
      
  neo4j:
    image: neo4j:latest
    ports:
      - "7474:7474"
      - "7687:7687"
    volumes:
      - neo4j_data:/data
    environment:
      - NEO4J_AUTH=neo4j/password
      
  elasticsearch:
    image: elasticsearch:8.11.0
    ports:
      - "9200:9200"
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
```

## API Endpoints for AI Integration

### Core AI Endpoints
- `POST /api/v1/ai/chat/` - Send message to AI assistant
- `GET /api/v1/ai/conversations/` - List user conversations
- `POST /api/v1/ai/conversations/` - Create new conversation
- `GET /api/v1/ai/conversations/{conv_id}` - Get conversation history
- `DELETE /api/v1/ai/conversations/{conv_id}` - Delete conversation
- `POST /api/v1/ai/analyze/` - Analyze test results with AI
- `GET /api/v1/ai/models/` - List available AI models
- `POST /api/v1/ai/models/pull` - Download Ollama model

### Command Management Endpoints
- `POST /api/v1/ai/commands/` - Submit command for approval
- `PUT /api/v1/ai/commands/{cmd_id}/approve` - Approve command execution
- `PUT /api/v1/ai/commands/{cmd_id}/deny` - Deny command execution

### RAG Endpoints
- `POST /api/v1/ai/rag/documents/` - Add documents to vector store
- `GET /api/v1/ai/rag/search/` - Semantic search in knowledge base
- `DELETE /api/v1/ai/rag/documents/{doc_id}` - Remove document from vector store
- `POST /api/v1/ai/rag/reindex/` - Rebuild vector embeddings

### CAG Endpoints
- `GET /api/v1/ai/cag/context/{test_id}` - Get dynamic context for test
- `POST /api/v1/ai/cag/relationships/` - Create vulnerability relationships
- `GET /api/v1/ai/cag/graph/{entity_id}` - Get entity relationship graph
- `POST /api/v1/ai/cag/inference/` - Perform context-based inference

### KAG Endpoints
- `POST /api/v1/ai/kag/facts/` - Add structured security facts
- `GET /api/v1/ai/kag/query/` - Query knowledge base
- `POST /api/v1/ai/kag/reasoning/` - Apply logical reasoning to security data
- `GET /api/v1/ai/kag/ontology/` - Get security ontology structure

## Security and Privacy Considerations

### Data Protection
- **Encryption at Rest:** All AI conversations and analysis results encrypted
- **Encryption in Transit:** TLS 1.3 for all AI API communications
- **Local Processing:** Option for completely offline AI operation with Ollama
- **Data Retention:** Configurable conversation and analysis data retention policies

### Access Control
- **Role-Based Access:** Different AI features available based on user role
- **Command Approval:** All AI-suggested commands require human approval
- **Audit Logging:** Complete trail of AI interactions and decisions
- **API Key Security:** Encrypted storage and secure handling of provider keys

### Compliance
- **Data Residency:** Support for local-only AI processing for sensitive environments
- **GDPR Compliance:** User data deletion and export capabilities
- **SOC 2 Compliance:** Comprehensive logging and access controls
- **Security Standards:** Follow OWASP guidelines for AI security

This architecture provides comprehensive AI integration while maintaining security, privacy, and operational excellence standards required for enterprise security platforms.
